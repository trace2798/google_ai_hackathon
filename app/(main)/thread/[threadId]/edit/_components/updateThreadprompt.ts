"use server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function updateThreadPrompt(
  threadId: string,
  prompt: string
) {
  const profile = await currentProfile();
  try {
    const thread = await db.thread.findUnique({
      where: {
        id: threadId,
      },
    });
    //console.log("thread", thread);
    if (thread?.profileId !== profile?.id) {
      return "Unauthorized";
    }
    await db.thread.update({
      where: {
        id: threadId,
      },
      data: {
        prompt: prompt,
      },
    });
    await db.activity.create({
      data: {
        message: `You changed prompt for thread: ${thread?.title}`,
        profileId: profile?.id as string,
      },
    });
    return "Done";
  } catch (error) {
    //console.log(error);
  }
}
