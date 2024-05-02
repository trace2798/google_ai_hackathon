import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import {
  GoogleGenerativeAI,
  TaskType,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Index } from "@upstash/vector";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === "user" || message.role === "system"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
});
export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const profile = await currentProfile();
    const body = await request.json();
    const question = body.prompt;

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
    const prompt =
      thread.prompt ||
      `You are an helpful AI assistant who is responsible to answer users question. 
    Both the question and content from which you should answer will be provided. 
    Only include links in markdown format.
    Refuse any answer that does not have to do with its content.
    Provide concise answers.`;
    const modelName = "text-embedding-004"; // 768 dimensions
    const taskType = TaskType.SEMANTIC_SIMILARITY;

    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: modelName,
      taskType: taskType,
    });
    const embeddingedQuestion = await embeddings.embedQuery(question);

    const content = await index.query({
      vector: embeddingedQuestion as number[],
      includeVectors: false,
      topK: 10,
      includeMetadata: true,
      filter: `fileId = '${thread.fileId}'`,
    });
    let concentratedContent = "";
    for (let i = 0; i < content.length; i++) {
      concentratedContent += content[i]?.metadata?.pageContent + " ";
    }
    console.log("Content Length", concentratedContent.length);

    // const chat = genAI.getGenerativeModel({ model: "gemini-1.0-pro" })
    //systemInstruction is only working with gemini-1.5-pro-latest not with gemini-pro. Error: GoogleGenerativeAIError: [400 Bad Request] Developer instruction is not enabled for models/gemini-1.0-pro
    // const response = await genAI
    //   .getGenerativeModel({
    //     model: "gemini-1.0-pro",
    //     // systemInstruction: {
    //     //   role: "system",
    //     //   parts: [
    //     //     {
    //     //       text: prompt,
    //     //     },
    //     //   ],
    //     // },
    //   })
    //   .startChat({
    //     history: [
    //       {
    //         role: "user",
    //         parts: [{ text: "Hello, I need some help." }],
    //       },
    //       {
    //         role: "model",
    //         parts: [{ text: `${prompt}` }],
    //       },
    //     ],
    //     generationConfig: {
    //       maxOutputTokens: 100,
    //     },
    //   })
    //   .sendMessageStream(
    //     `${prompt}. Now answer: ${question} referencing this content: ${concentratedContent}.`
    //   );
    // // .generateContentStream({
    // //   contents: [
    // //     {
    // //       role: "user",
    // //       parts: [
    // //         {
    // //           text: `${prompt}. Now answer: ${question} referencing this content: ${concentratedContent}.`,
    // //         },
    // //       ],
    // //     },
    // //   ],
    // // });
    // // const send = `${prompt}. Now answer: ${question} referencing this content: ${concentratedContent}.`
    // // const response = await genAI
    // //   .getGenerativeModel({ model: "gemini-pro" })
    // //   .generateContentStream(buildGoogleGenAIPrompt(question));

    //Providing the best answers this way but the system instruction is only working with gemini-1.5-pro-latest
    const response = await genAI
      .getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: prompt,
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
                text: `Answer what the user ask, user input: ${question} referencing this content: ${concentratedContent}.`,
              },
            ],
          },
        ],
      });
    // const send = `${prompt}. Now answer: ${question} referencing this content: ${concentratedContent}.`
    // const response = await genAI
    //   .getGenerativeModel({ model: "gemini-pro" })
    //   .generateContentStream(buildGoogleGenAIPrompt(question));
    const stream = GoogleGenerativeAIStream(response, {
      // onStart: async () => {
        // This callback is called when the stream starts
        // You can use this to save the prompt to your database
        // console.log(prompt);
        // console.log(body);
        // console.log(question);
        // console.log(concentratedContent);
      // },
      onToken: async (token: string) => {
        console.log(token);
      },
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
    console.log("Error Internal:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
