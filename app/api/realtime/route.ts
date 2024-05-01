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
    StreamData,
    StreamingTextResponse,
  } from "ai";
//   import cheerio from "cheerio";
  import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
  import { MemoryVectorStore } from "langchain/vectorstores/memory";
  import { Calculator } from "@langchain/community/tools/calculator";
  import { WebBrowser } from "langchain/tools/webbrowser";
  
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
  
  export async function POST(request: Request) {
    try {
      const body = await request.json();
      console.log("BODY", body);
      // console.log("messages length", body.messages.length);
      // const question = `${body.messages[body.messages.length - 1].content}`;
      const question = body.prompt;
      console.log("Question: ", question);
  
      const tools = [
        new BraveSearch({ apiKey: process.env.BRAVE_SEARCH_API_KEY }),
        new Calculator(),
        new WebBrowser({ model, embeddings }),
      ];
      const chain = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "zero-shot-react-description",
        verbose: true,
      });
      console.log("executor", chain);
      console.log("Loaded agent.");
      const data = new StreamData();
      // const result = await executor.invoke({
      //   input: question,
      // });
      const { stream, handlers } = LangChainStream({
        onFinal: () => {
          data.append(JSON.stringify({ key: question })); // example
          data.close();
        },
      });
      // console.log("result", result);
      await chain.stream(
        {
          input: question,
        },
        { callbacks: [handlers] }
      );
      // console.log("result", result);
      // const data = new StreamData();
  
      // console.log("DATA", data);
      // // let answer = "";
      // try {
      //   for await (const chunk of llmStream) {
      //     console.log("INSIDE for loop", JSON.stringify(chunk, null, 2));
      //     console.log("------");
      //     console.log("stream", llmStream);
      //     // const answer = await stream.next();
      //     // Respond with the stream
      //     const output = GoogleGenerativeAIStream(chunk.output);
      //     console.log(new StreamingTextResponse(output));
      //     return new StreamingTextResponse(output);
      //   }
      // } catch (error) {
      //   console.log("error stream", error);
      //   // return new NextResponse(error, {
      //   //   status: 500,
      //   // });
      // }
      // console.log("result", result);
      // const response = await result.output;
      // return new StreamingTextResponse(result.output);
      console.log("stream", stream);
      console.log("data", data);
      return new StreamingTextResponse(stream, {}, data);
      // return new StreamingTextResponse(llmStream);
      // const stream = GoogleGenerativeAIStream(result.output);
      // console.log("stream", stream);
      // // Respond with the stream
      // console.log(new StreamingTextResponse(stream));
      // return new StreamingTextResponse(stream);
      // const stream = GoogleGenerativeAIStream();
      // const answer = await result.output;
      // console.log("answer", answer);
      // return new StreamingTextResponse(result.output);
    } catch (error) {
      console.log("error", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  