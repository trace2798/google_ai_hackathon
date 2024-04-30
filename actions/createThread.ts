"use server";

import { db } from "@/lib/db";

export async function createFileThread(
  profileId: string | undefined,
  fileId: string
) {
  try {
    const threads = await db.thread.create({
      data: {
        prompt: `You are an helpful AI assistant who is responsible to answer users question. 
            Both the question and content from which you should answer will be provided. 
            Only include links in markdown format.
            Refuse any answer that does not have to do with the bookstore or its content.
            Provide short, concise answers.`,
        title: "untitled",
        fileId: fileId,
        profileId: profileId || "",
        threadType: "DOC",
      },
    });
    console.log("threads", threads);

    return threads.id;
  } catch (error) {
    console.log(error);
  }
}
