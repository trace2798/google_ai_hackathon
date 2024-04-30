import { db } from "@/lib/db";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
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
      (message) => message.role === "user" || message.role === "assistant"
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
    const body = await request.json();
    console.log("messages", body);
    const question = body.prompt;
    console.log("Question: ", question);

    const thread = await db.thread.findUnique({
      where: {
        id: params.threadId,
      },
    });
    if (!thread) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const prompt =
      thread.prompt ||
      `You are an helpful AI assistant who is responsible to answer users question. 
    Both the question and content from which you should answer will be provided. 
    Only include links in markdown format.
    Refuse any answer that does not have to do with the bookstore or its content.
    Provide short, concise answers.`;
    const modelName = "text-embedding-004"; // 768 dimensions
    const taskType = TaskType.SEMANTIC_SIMILARITY;
    console.log("Checked TOken Length");

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
    console.log("Upstash content", content);
    // const geminiStream = await genAI
    //   .getGenerativeModel({ model: "gemini-pro" })
    //   .generateContentStream(buildGoogleGenAIPrompt(prompt) as any);
    console.log("1");
    // console.log(`${companion?.instructions} answer: ${prompt}`);
    let concentratedContent = "";
    for (let i = 0; i < content.length; i++) {
      concentratedContent += content[i]?.metadata?.pageContent + " ";
    }
    console.log("Concentrated Content", concentratedContent);

    const response = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContentStream({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${prompt}. Now answer: ${question} with this content: ${concentratedContent}. Do not make up stuff and only answer based on the content provided. If you do not know the answer just say it.`,
              },
            ],
          },
        ],
      });
    console.log(response);
    console.log("2");
    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(response);
    console.log("stream", stream);
    // Respond with the stream
    console.log(new StreamingTextResponse(stream));
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("Error Internal:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
