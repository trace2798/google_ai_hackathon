"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function restoreThread(
  profileId: string | undefined,
  threadId: string
) {
  try {
    const profile = await currentProfile();
    console.log(profile);
    console.log(profileId);
    if (!profile) {
      return "Forbidden No Profile";
    }
    if (profile?.id !== profileId) {
      return "Unauthorized";
    }
    const thread = await db.thread.findUnique({
      where: {
        id: threadId,
      },
    });

    const file = await db.file.findUnique({
      where: {
        id: thread?.fileId as string,
      },
    });
    if (!file) {
      return "File not found";
    }
    if (file.toDelete === true) {
      return "You need to restore the file to restore this thread";
    }
    const restoreThread = await db.thread.update({
      where: {
        id: thread?.id,
      },
      data: {
        toDelete: false,
      },
    });

    return "Done";
  } catch (error) {
    console.log("Error action deleteFile", error);
  }
}
