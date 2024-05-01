// import {
//   GoogleGenerativeAI,
//   HarmBlockThreshold,
//   HarmCategory,
//   TaskType,
// } from "@google/generative-ai";
// import { BraveSearch } from "@langchain/community/tools/brave_search";
// import { Calculator } from "@langchain/community/tools/calculator";
// import { JsonOutputParser } from "@langchain/core/output_parsers";
// import type { ChatPromptTemplate } from "@langchain/core/prompts";
// import {
//   ChatGoogleGenerativeAI,
//   GoogleGenerativeAIEmbeddings,
// } from "@langchain/google-genai";
// import { LangChainStream, StreamData, StreamingTextResponse } from "ai";
// import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
// import { pull } from "langchain/hub";
// import { WebBrowser } from "langchain/tools/webbrowser";
// import { NextResponse } from "next/server";

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
// const modelName = "text-embedding-004"; // 768 dimensions
// const taskType = TaskType.SEMANTIC_SIMILARITY;
// const embeddings = new GoogleGenerativeAIEmbeddings({
//   modelName: modelName,
//   taskType: taskType,
// });

// export async function POST(
//   request: Request,
//   { params }: { params: { threadId: string } }
// ) {
//   try {
//     const body = await request.json();
//     console.log("BODY", body);
//     const question = `${body.messages[body.messages.length - 1].content}`;
//     // const question = body.prompt;
//     const tools = [
//       new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY }),
//       new Calculator(),
//       new WebBrowser({ model, embeddings }),
//     ];

//     const prompt = await pull<ChatPromptTemplate>(
//       "hwchase17/structured-chat-agent"
//     );

//     const agent = await createStructuredChatAgent({
//       llm: model,
//       tools,
//       prompt,
//     });
//     console.log("1");
//     const chain = new AgentExecutor({
//       agent,
//       tools,
//     });
//     console.log("executor", chain);
//     // const data = new StreamData();
//     // console.log("2");
//     // const { stream, handlers } = LangChainStream({
//     //   onFinal: () => {
//     //     data.append(JSON.stringify({ key: question })); // example
//     //     data.close();
//     //   },
//     // });
//     console.log("3");
//     const result = await chain.stream({
//       input: question,
//     });
//     console.log(result)
//     // return new  NextResponse(JSON.stringify(result),
//     //   // { output: result.output},
//     //   { status: 200 },
//     // );
//     return new StreamingTextResponse(result);
//     // const textEncoder = new TextEncoder();
//     // const transformStream = new ReadableStream({
//     //   async start(controller) {
//     //     for await (const chunk of result) {
//     //       if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
//     //         const addOp = chunk.ops[0];
//     //         if (
//     //           addOp.path.startsWith("/logs/ChatOpenAI") &&
//     //           typeof addOp.value === "string" &&
//     //           addOp.value.length
//     //         ) {
//     //           controller.enqueue(textEncoder.encode(addOp.value));
//     //         }
//     //       }
//     //     }
//     //     controller.close();
//     //   },
//     // });

//     // return new StreamingTextResponse(transformStream);
//     // console.log(result);
//     // for await (const chunk of result) {
//     //   console.log(JSON.stringify(chunk, null, 2));
//     //   console.log("------");
//     // }
//     // await chain.stream(
//     //   {
//     //     input: question,
//     //   },
//     //   { callbacks: [handlers] }
//     // );
//     // console.log("4");
//     // console.log(result);
//     // const result = await executor.invoke({
//     //   input: question,
//     // });
//     // return new Response(JSON.stringify( result), { status: 200 });
//     // return new StreamingTextResponse(stream, {}, data);
//     // return new NextResponse(JSON.stringify(result), { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Error", { status: 500 });
//   }
// }

// // import {
// //   GoogleGenerativeAI,
// //   HarmBlockThreshold,
// //   HarmCategory,
// //   TaskType,
// // } from "@google/generative-ai";
// // import { BraveSearch } from "@langchain/community/tools/brave_search";
// // import { Calculator } from "@langchain/community/tools/calculator";
// // import { JsonOutputParser } from "@langchain/core/output_parsers";
// // import type { ChatPromptTemplate } from "@langchain/core/prompts";
// // import {
// //   ChatGoogleGenerativeAI,
// //   GoogleGenerativeAIEmbeddings,
// // } from "@langchain/google-genai";
// // import { LangChainStream, StreamData, StreamingTextResponse } from "ai";
// // import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
// // import { pull } from "langchain/hub";
// // import { WebBrowser } from "langchain/tools/webbrowser";
// // import { NextResponse } from "next/server";
// // import { AIMessage, HumanMessage } from "@langchain/core/messages";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// // const model = new ChatGoogleGenerativeAI({
// //   // modelName: "gemini-pro",
// //   modelName: "gemini-1.5-pro-latest",
// //   maxOutputTokens: 2048,
// //   safetySettings: [
// //     {
// //       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
// //       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
// //     },
// //   ],
// // });
// // const modelName = "text-embedding-004"; // 768 dimensions
// // const taskType = TaskType.SEMANTIC_SIMILARITY;
// // const embeddings = new GoogleGenerativeAIEmbeddings({
// //   modelName: modelName,
// //   taskType: taskType,
// // });

// // export async function POST(
// //   request: Request,
// //   { params }: { params: { threadId: string } }
// // ) {
// //   try {
// //     const body = await request.json();
// //     console.log("BODY", body);
// //     // const question = `${body.messages[body.messages.length - 1].content}`;
// //     const question = body.prompt;
// //     const tools = [
// //       new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY }),
// //       new Calculator(),
// //       new WebBrowser({ model, embeddings }),
// //     ];

// //     const prompt = await pull<ChatPromptTemplate>(
// //       "hwchase17/structured-chat-agent"
// //     );

// //     const agent = await createStructuredChatAgent({
// //       llm: model,
// //       tools,
// //       prompt,
// //     });
// //     console.log("1");
// //     const executor = new AgentExecutor({
// //       agent,
// //       tools,
// //     });
// //     console.log("executor", executor);

// //     console.log("3");
// //     const result = await executor.stream({
// //       input: question,
// //     });
// //     console.log(result);
// //     for await (const chunk of result) {
// //       console.log(JSON.stringify(chunk, null, 2));
// //       console.log("------");
// //       return new StreamingTextResponse(JSON.stringify(chunk, null, 2));
// //     }

// //     // const result = await executor.invoke({
// //     //   input: question,
// //     // });
// //     // console.log(result);
// //     // const final = new JsonOutputParser(result);
// //     // console.log(final);
// //     // console.log(JSON.stringify(final.lc_kwargs.output));
// //     // const res = JSON.stringify(final.lc_kwargs.output);
// //     // // return new NextResponse(final.lc_kwargs.output, { status: 200 });
// //     // return new NextResponse(res, {
// //     //   headers: { "Content-Type": "application/json" },
// //     // });
// //     return new NextResponse(JSON.stringify(result), { status: 200 });
// //   } catch (error) {
// //     console.log(error);
// //     return new NextResponse("Error", { status: 500 });
// //   }
// // }

import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import {
  AgentExecutor,
  initializeAgentExecutorWithOptions,
} from "langchain/agents";
import { NextResponse } from "next/server";
import { BraveSearch } from "langchain/tools";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  TaskType,
} from "@google/generative-ai";
import {
  GoogleGenerativeAIStream,
  LangChainStream,
  Message,
  StreamData,
  StreamingTextResponse,
} from "ai";
import cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Calculator } from "@langchain/community/tools/calculator";
import { WebBrowser } from "langchain/tools/webbrowser";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

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
    const profile = await currentProfile();
    const body = await request.json();
    console.log("BODY", body);
    // const question = `${body.messages[body.messages.length - 1].content}`;
    const question = body.prompt;
    // const messages = (body.messages ?? []).filter(
    //   (message: Message) =>
    //     message.role === "user" || message.role === "assistant",
    // );
    // console.log("messages", messages);
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
    // console.log("messages length", body.messages.length);

    console.log("Question: ", question);
    const messages = thread.messages;
    console.log(messages)
    const tools = [
      new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY }),
      new Calculator(),
      new WebBrowser({ model, embeddings }),
    ];
    const chain = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
      verbose: true,
    });
    const data = new StreamData();
    // const result = await executor.invoke({
    //   input: question,
    // });
    const { stream, handlers } = LangChainStream({
      onFinal: () => {
        data.append(JSON.stringify({ key: question })); // example
        data.close();
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
      },
    });
    // console.log("result", result);
    await chain.stream(
      {
        input: question,
        // chat_history: [
        //   new HumanMessage("hi! my name is cob"),
        //   new AIMessage("Hello Cob! How can I assist you today?"),
        // ],
      },
      { callbacks: [handlers] }
    );
    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
