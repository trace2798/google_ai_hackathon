import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import {
  GoogleGenerativeAI
} from "@google/generative-ai";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const profile = await currentProfile();
    // const body = await request.json();
    const body = await request.json();
    const question = body.prompt;
    // const question = `${body.messages[body.messages.length - 1].content}`;
    const tool = new WikipediaQueryRun({
      topKResults: 3,
      maxDocContentLength: 20000,
    });
    const thread = await db.thread.findUnique({
      where: {
        id: params.threadId,
      },
      include: {
        messages: true,
      },
    });

    if (!thread) {
      return new NextResponse("Not Found", { status: 404 });
    }
    if (!profile || profile?.id !== thread?.profileId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (thread?.messages.length > 0 && thread.title === thread.id) {
      const firstMessage = thread.messages[0].content;
      const first20Chars = firstMessage.substring(0, 20);

      await db.thread.update({
        where: {
          id: params.threadId,
        },
        data: {
          title: first20Chars as string,
        },
      });
    }
    await db.message.create({
      data: {
        content: question,
        role: "user",
        threadId: thread.id,
        profileId: profile?.id as string,
        fileId: thread.fileId as string,
      },
    });

    const keywords = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContentStream({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Your are a keyword extractor and you job is to extract the main keywords from the users question. Only extract the main keywords. Keywords will be used to search for wikipedia articles. The users question:${question}. `,
              },
            ],
          },
        ],
      });
    const key = (await keywords.response).text();
    // //console.log(key);
    const res = await tool.call(key);
    // //console.log(res);
    const specialInstruction =
      thread.prompt ||
      "You are a elite research assistant. Your job is to answer users question based on available information. Provide detailed concise answer.";
    const response = await genAI
      .getGenerativeModel({
        // model: "gemini-pro",
        model: "gemini-1.5-pro-latest",
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: specialInstruction,
            },
          ],
        },
      })
      .generateContentStream({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Explain in detail the users question:${question} based on this content: ${res}. Always provide source/reference links if applicable.`,
              },
            ],
          },
        ],
      });
    
    const stream = GoogleGenerativeAIStream(response, {
      onCompletion: async (completion: string) => {
        await db.message.create({
          data: {
            content: completion,
            role: "system",
            threadId: thread.id,
            profileId: profile?.id as string,
            fileId: thread.fileId as string,
          },
        });
        await db.thread.update({
          where: {
            id: thread.id,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
