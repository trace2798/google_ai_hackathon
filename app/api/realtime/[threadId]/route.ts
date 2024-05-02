import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import {
  HarmBlockThreshold,
  HarmCategory,
  TaskType,
} from "@google/generative-ai";
import { BraveSearch } from "@langchain/community/tools/brave_search";
import { Calculator } from "@langchain/community/tools/calculator";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import {
  LangChainStream,
  Message,
  StreamData,
  StreamingTextResponse,
} from "ai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { WebBrowser } from "langchain/tools/webbrowser";
import { NextResponse } from "next/server";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-pro-latest",
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
const convertVercelMessageToLangChainMessage = (message: Message) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "system") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};
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
    const messages = (thread.messages ?? [])
      .filter(
        (message: Message) =>
          message.role === "user" || message.role === "system"
      )
      .slice(-15);
    const previousMessages = messages
      .slice(0, -1)
      .map(convertVercelMessageToLangChainMessage);
    const tools = [
      new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY }),
      new Calculator(),
      new WebBrowser({ model, embeddings }),
    ];
    const chain = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
      // agentType: "structured-chat-zero-shot-react-description",
      verbose: true,
    });
    const data = new StreamData();
    const { stream, handlers } = LangChainStream({
      onFinal: () => {
        data.append(JSON.stringify({ key: question })); // example
        data.close();
      },
      onCompletion: async (completion: string) => {
        //console.log("completion", completion.split("\n"));
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
    await chain.stream(
      {
        input: question,
        chat_history: [previousMessages],
      },
      { callbacks: [handlers] }
    );
    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    //console.log("error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// import {
//   ChatGoogleGenerativeAI,
//   GoogleGenerativeAIEmbeddings,
// } from "@langchain/google-genai";
// import {
//   AgentExecutor,
//   createStructuredChatAgent,
//   initializeAgentExecutorWithOptions,
// } from "langchain/agents";
// import { NextResponse } from "next/server";
// import { BraveSearch } from "langchain/tools";
// import { pull } from "langchain/hub";
// import {
//   GoogleGenerativeAI,
//   HarmBlockThreshold,
//   HarmCategory,
//   TaskType,
// } from "@google/generative-ai";
// import {
//   GoogleGenerativeAIStream,
//   LangChainStream,
//   Message,
//   StreamData,
//   StreamingTextResponse,
// } from "ai";
// import cheerio from "cheerio";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { Calculator } from "@langchain/community/tools/calculator";
// import { WebBrowser } from "langchain/tools/webbrowser";
// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// const model = new ChatGoogleGenerativeAI({
//   modelName: "gemini-pro",
//   maxOutputTokens: 2048,
//   safetySettings: [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//     },
//   ],
// });
// // const model = genAI.getGenerativeModel({ model: "gemini-pro" } );
// const modelName = "text-embedding-004"; // 768 dimensions
// const taskType = TaskType.SEMANTIC_SIMILARITY;
// const embeddings = new GoogleGenerativeAIEmbeddings({
//   modelName: modelName,
//   taskType: taskType,
// });
// const convertVercelMessageToLangChainMessage = (message: Message) => {
//   if (message.role === "user") {
//     return new HumanMessage(message.content);
//   } else if (message.role === "assistant") {
//     return new AIMessage(message.content);
//   } else {
//     return new ChatMessage(message.content, message.role);
//   }
// };
// export async function POST(
//   request: Request,
//   { params }: { params: { threadId: string } }
// ) {
//   try {
//     const profile = await currentProfile();
//     const body = await request.json();
//     //console.log("BODY", body);
//     // const question = `${body.messages[body.messages.length - 1].content}`;
//     const question = body.prompt;

//     const prompt = await pull<ChatPromptTemplate>(
//       "hwchase17/structured-chat-agent"
//     );

//     // //console.log("messages length", body.messages.length);

//     //console.log("Question: ", question);
//     // const messages = (thread.messages ?? []).filter(
//     //   (message: Message) =>
//     //     message.role === "user" || message.role === "assistant"
//     // );
//     // //console.log("messages", messages);
//     // //console.log(messages);
//     // const previousMessages = messages
//     //   .slice(0, -1)
//     //   .map(convertVercelMessageToLangChainMessage);
//     // //console.log("previousMessages", previousMessages);
//     const tools = [
//       new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY }),
//       new Calculator(),
//       new WebBrowser({ model, embeddings }),
//     ];
//     const agent = await createStructuredChatAgent({
//       llm: model,
//       tools,
//       prompt,
//     });
//     //console.log("1");
//     const chain = new AgentExecutor({
//       agent,
//       tools,
//     });
//     const result = await chain.invoke(
//       {
//         input: question,
//         // chat_history: [previousMessages],
//       }
//       //   { callbacks: [handlers] }
//     );
//     // const stream = GoogleGenerativeAIStream(result);
//     //console.log("result", result);
//     // return new StreamingTextResponse(result.output, {}, data);
//     return NextResponse.json(result.response.text() , { status: 200 });
//   } catch (error) {
//     //console.log("error", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
