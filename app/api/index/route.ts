import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextRequest, NextResponse } from "next/server";
// import { JsonOutputFunctionsParser } from "langchain/output_parsers";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { Index } from "@upstash/vector";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
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
      const pdfLoader = new PDFLoader(document as Blob, {
        parsedItemSeparator: " ",
      });

      const docs = await pdfLoader.load();
      const pagesAmt = docs.length;
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
      try {
        for (const doc of docs) {
          const txtPath = doc.metadata.loc.pageNumber;
          const text = doc.pageContent.replace(/(\s*\n\s*)+/g, " ");
          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 5000, //since the model can take upto 512 token as input
            chunkOverlap: 50,
          });
          //Split text into chunks (documents)
          const chunks = await textSplitter.createDocuments([text]);

          const modelName = "text-embedding-004"; // 768 dimensions
          const taskType = TaskType.SEMANTIC_SIMILARITY;
          // console.log("Checked TOken Length");

          const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: modelName,
            taskType: taskType,
          });

          // Use the embedDocuments method to get the embeddings for your documents
          const embeddingsArrays = await embeddings.embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
          );
          // console.log("GOOGLE EMBEDDING", embeddingsArrays);
          const batchSize = 100;
          let batch: any = [];
          for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];
            const vector = {
              id: `${file.id}_${txtPath}_${idx}`,
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
                const result = await index.upsert({
                  id: vector.id,
                  vector: vector.values,
                  metadata: {
                    pageContent: vector.metadata.pageContent,
                    pageNumber: vector.metadata.txtPath,
                    profileId: profile?.id,
                    fileId: file.id,
                  },
                });
                console.log("result vector upsert", result);
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
            prompt: `You are an helpful AI assistant who is responsible to answer users question. 
            Both the question and content from which you should answer will be provided. 
            Only include links in markdown format.
            Refuse any answer that does not have to do with its content.
            Provide concise answers.`,
            title: file.name,
            fileId: file.id,
            profileId: profile.id || "",
            threadType: "DOC",
          },
        });
        await db.activity.createMany({
          data: [
            {
              message: `Thread called ${file.name} created.`,
              profileId: profile.id || "",
            },
            {
              message: `File ${file.name} created and embedded successfully`,
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
}
