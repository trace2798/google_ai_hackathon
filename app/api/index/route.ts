import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextRequest, NextResponse } from "next/server";
// import { JsonOutputFunctionsParser } from "langchain/output_parsers";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { Index } from "@upstash/vector";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { currentCompanionId } from "@/lib/companion-id";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.formData();
  // console.log("BODY", body);
  const document = body.get("uploadedFile");
  // console.log("DOCUMENT", document);
  const profile = await currentProfile();
  // console.log("PROFILE", profile);
  if (!profile) {
    return new NextResponse(JSON.stringify({ message: "Profile not found" }), {
      status: 401,
    });
  }
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });

  if ((document as File).type === "application/pdf") {
    try {
      // console.log("PDF", document);
      const pdfLoader = new PDFLoader(document as Blob, {
        parsedItemSeparator: " ",
      });

      const docs = await pdfLoader.load();
      // console.log("DOCS", docs);
      // console.log("DOCS LOC", docs[0].metadata.loc);
      const pagesAmt = docs.length;
      // console.log("Page Amount", pagesAmt);
      const selectedDocuments = docs.filter(
        (doc) => doc.pageContent !== undefined
      );

      const file = await db.file.create({
        data: {
          name: (document as File).name,
          profileId: profile?.id as string,
          indexDone: false,
          uploadStatus: "PROCESSING",
          pageAmt: pagesAmt ?? 0,
          fileType: "PDF",
        },
      });
      // console.log("Created FILE", file);
      try {
        for (const doc of docs) {
          const txtPath = doc.metadata.loc.pageNumber;
          // console.log("Page Number", txtPath);
          // const text = doc.pageContent;
          const text = doc.pageContent.replace(/(\s*\n\s*)+/g, " ");
          // console.log("Text Content:", text);
          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 5000, //since the model can take upto 512 token as input
            chunkOverlap: 50,
          });
          //Split text into chunks (documents)
          const chunks = await textSplitter.createDocuments([text]);
          // console.log(`Total chunks: ${chunks.length}`);

          // console.log("EMBED CALL HERE");
          // const modelName = "thenlper/gte-large";

          // const embeddingsArrays = await new OpenAIEmbeddings({
          //   configuration: {
          //     baseURL: "https://api.endpoints.anyscale.com/v1",
          //   },
          //   modelName: modelName,
          // }).embedDocuments(
          //   chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))

          // );
          // const model = genAI.getGenerativeModel({ model: "embedding-001"});
          const modelName = "text-embedding-004"; // 768 dimensions
          const taskType = TaskType.SEMANTIC_SIMILARITY;
          console.log("Checked TOken Length");

          // Create a new instance of GoogleGenerativeAIEmbeddings
          const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: modelName,
            taskType: taskType,
          });

          // Use the embedDocuments method to get the embeddings for your documents
          const embeddingsArrays = await embeddings.embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
          );
          console.log("GOOGLE EMBEDDING", embeddingsArrays);
          const batchSize = 100;
          let batch: any = [];
          for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];
            // const { totalTokens } = await model.countTokens(chunk.pageContent);
            // console.log("Total Tokens", totalTokens);
            const vector = {
              id: `${txtPath}_${idx}`,
              values: embeddingsArrays[idx],
              metadata: {
                ...chunk.metadata,
                loc: JSON.stringify(chunk.metadata.loc),
                pageContent: chunk.pageContent,
                txtPath: txtPath,
              },
            };
            batch = [...batch, vector];
            // When batch is full or it's the last item, upsert the vectors
            if (batch.length === batchSize || idx === chunks.length - 1) {
              for (const vector of batch) {
                await index.upsert({
                  id: vector.id,
                  vector: vector.values,
                  metadata: {
                    pageContent: vector.metadata.pageContent,
                    pageNumber: vector.metadata.txtPath,
                    profileId: profile?.id,
                    fileId: file.id,
                  },
                });
              }
              batch = [];
            }
          }
        }
        const updateFileInfo = await db.file.update({
          where: {
            id: file.id,
          },
          data: {
            uploadStatus: "SUCCESS",
            indexDone: true,
          },
        });
        const createThread = await db.thread.create({
          data: {
            prompt: "",
            title: file.name,
            fileId: file.id,
            profileId: profile.id || "",
            threadType: "DOC",
          },
        });
        await db.activity.createMany({
          data: [
            {
              message: `File ${file.name} created and embedded successfully`,
              profileId: profile.id || "",
            },
            {
              message: `Thread called ${file.name} created.`,
              profileId: profile.id || "",
            },
          ],
        });

        return new NextResponse(JSON.stringify(createThread), {
          status: 200,
        });
      } catch (error) {
        console.log("Error embedding pdf document", error);
      }
    } catch (error) {
      console.log("Error parsing pdf document");
    }
  } else if ((document as File).type === "text/plain") {
    try {
      const loader = new TextLoader(document as Blob);
      const docs = await loader.load();
      console.log("DOCS text", docs);
    } catch (error) {
      console.log("Error parsing text document", error);
    }
  }

  try {
    // const pdfLoader = new PDFLoader(document as Blob, {
    //   parsedItemSeparator: " ",
    // });

    // const docs = await pdfLoader.load();
    // console.log("DOCS", docs);
    // console.log("DOCS LOC", docs[0].metadata.loc);
    // const pagesAmt = docs.length;
    // console.log("Page Amount", pagesAmt);
    // const selectedDocuments = docs.filter(
    //   (doc) => doc.pageContent !== undefined
    // );
    // const texts = selectedDocuments.map((doc) => doc.pageContent);

    // const prompt =
    //   "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quizz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

    // if (!process.env.OPENAI_API_KEY) {
    //   return NextResponse.json(
    //     { error: "OpenAI API key not provided" },
    //     { status: 500 }
    //   );
    // }

    // const model = new ChatOpenAI({
    //   openAIApiKey: process.env.OPENAI_API_KEY,
    //   modelName: "gpt-4-1106-preview",
    // });

    // const parser = new JsonOutputFunctionsParser();
    // const extractionFunctionSchema = {
    //   name: "extractor",
    //   description: "Extracts fields from the output",
    //   parameters: {
    //     type: "object",
    //     properties: {
    //       quizz: {
    //         type: "object",
    //         properties: {
    //           name: { type: "string" },
    //           description: { type: "string" },
    //           questions: {
    //             type: "array",
    //             items: {
    //               type: "object",
    //               properties: {
    //                 questionText: { type: "string" },
    //                 answers: {
    //                   type: "array",
    //                   items: {
    //                     type: "object",
    //                     properties: {
    //                       answerText: { type: "string" },
    //                       isCorrect: { type: "boolean" },
    //                     },
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // };
    // console.log("EXrcted json", extractionFunctionSchema);
    // const runnable = model
    //   .bind({
    //     functions: [extractionFunctionSchema],
    //     function_call: { name: "extractor" },
    //   })
    //   .pipe(parser);

    // const message = new HumanMessage({
    //   content: [
    //     {
    //       type: "text",
    //       text: prompt + "\n" + texts.join("\n"),
    //     },
    //   ],
    // });

    // const result: any = await runnable.invoke([message]);
    // console.log(result);

    // const { quizzId } = await saveQuizz(result.quizz);

    return new NextResponse("OK");
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
