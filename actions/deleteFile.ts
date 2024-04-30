"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function deleteFile(
  profileId: string | undefined,
  fileId: string
) {
  try {
    const profile = await currentProfile();
    if (profile?.id === profileId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    const file = await db.file.findUnique({
      where: {
        id: fileId,
      },
    });
    const updateThreadToDelete = await db.thread.updateMany({
      where: {
        fileId: fileId,
        toDelete: false,
      },
      data: {
        toDelete: true,
      },
    });
    const updateMessageToDelete = await db.message.updateMany({
      where: {
        fileId: fileId,
        toDelete: false,
      },
      data: {
        toDelete: true,
      },
    });
    const softDeleteFile = await db.file.update({
      where: {
        id: file?.id,
      },
      data: {
        toDelete: true,
      },
    });

    return "Done";
  } catch (error) {
    console.log(error);
  }
}
