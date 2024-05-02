"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function createWebThread(profileId: string | undefined) {
  const profile = await currentProfile();
  try {
    const thread = await db.thread.create({
      data: {
        prompt: ``,
        title: "untitled",
        fileId: "",
        profileId: profileId || "",
        threadType: "WEB",
      },
    });
    //console.log("thread", thread);
    await db.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        title: thread.id,
      },
    });
    await db.activity.create({
      data: {
        message: `Thread called ${thread?.id} has been created for WebChat`,
        profileId: profile?.id as string,
      },
    });
    return thread.id;
  } catch (error) {
    //console.log(error);
  }
}

export async function softDeleteWebThread(
  profileId: string | undefined,
  threadId: string
) {
  try {
    const profile = await currentProfile();
    //console.log(profile);
    //console.log(threadId);
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
    //console.log("thread", thread);
    if (!thread) {
      return "Error: Thread not found";
    }
    const updateThread = await db.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        toDelete: true,
      },
    });
    //console.log("updateThread", updateThread);
    await db.activity.create({
      data: {
        message: `Thread called ${thread?.title} has been soft deleted`,
        profileId: profile?.id,
      },
    });
    return "Done";
  } catch (error) {
    //console.log("Error action deleteFile", error);
  }
}

export async function restoreWebThread(
  profileId: string | undefined,
  threadId: string
) {
  try {
    const profile = await currentProfile();
    //console.log(profile);
    //console.log(profileId);
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

    //   const file = await db.file.findUnique({
    //     where: {
    //       id: thread?.fileId as string,
    //     },
    //   });
    //   if (!file) {
    //     return "File not found";
    //   }
    //   if (file.toDelete === true) {
    //     return "You need to restore the file to restore this thread";
    //   }
    const restoreThread = await db.thread.update({
      where: {
        id: thread?.id,
      },
      data: {
        toDelete: false,
      },
    });
    await db.activity.create({
      data: {
        message: `Thread called ${thread?.title} has been restored [Web Thread]`,
        profileId: profile?.id,
      },
    });

    return "Done";
  } catch (error) {
    //console.log("Error action deleteFile", error);
  }
}


export async function permanentlyDeleteWebThreadAction(
    profileId: string | undefined,
    threadId: string
  ) {
    try {
      const profile = await currentProfile();
      //console.log(profile);
      //console.log(profileId);
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
  
      const restoreThread = await db.thread.delete({
        where: {
          id: threadId,
        },
      });
      await db.activity.create({
        data: {
          message: `Thread called ${thread?.title} has been permanently deleted [Web Thread]`,
          profileId: profile?.id,
        },
      });
  
      return "Done";
    } catch (error) {
      //console.log("Error action deleteFile", error);
    }
  }
  