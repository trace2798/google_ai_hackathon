import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import cheerio from "cheerio";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { NextResponse } from "next/server";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { GooglePlacesAPI } from "@langchain/community/tools/google_places";
import { OpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tool = new WikipediaQueryRun({
      topKResults: 2,
      maxDocContentLength: 25000,
    });

    const question = `${body.messages[body.messages.length - 1].content}`;

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

    const res = await tool.call(key);
    console.log(res);
    const response = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
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
    console.log("2");
    const stream = GoogleGenerativeAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
