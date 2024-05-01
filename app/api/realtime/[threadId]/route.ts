import { Calculator } from "@langchain/community/tools/calculator";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { BraveSearch } from "langchain/tools";
import { WebBrowser } from "langchain/tools/webbrowser";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  TaskType,
} from "@google/generative-ai";
import { pull } from "langchain/hub";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});
const modelName = "text-embedding-004"; // 768 dimensions
const taskType = TaskType.SEMANTIC_SIMILARITY;
const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: modelName,
  taskType: taskType,
});

export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const body = await request.json();
    console.log("BODY", body);
    // const question = `${body.messages[body.messages.length - 1].content}`;
    const question = body.prompt;
    const tools = [
      new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY }),
      new Calculator(),
      new WebBrowser({ model, embeddings }),
    ];

    const prompt = await pull<ChatPromptTemplate>(
      "hwchase17/structured-chat-agent"
    );

    const agent = await createStructuredChatAgent({
      llm: model,
      tools,
      prompt,
    });
    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    const result = await agentExecutor.invoke({
      input: question,
    });

    console.log(result);
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
}
