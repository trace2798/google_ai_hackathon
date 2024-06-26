"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function restoreFile(
  profileId: string | undefined,
  fileId: string
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
    const file = await db.file.findUnique({
      where: {
        id: fileId,
      },
    });
    if (!file) {
      return "File not found";
    }
    const restoreFile = await db.file.update({
      where: {
        id: file.id,
      },
      data: {
        toDelete: false,
      },
    });
    await db.activity.create({
      data: {
        message: `File called ${file.name} has been restored`,
        profileId: profile?.id as string,
      },
    });

    return "Done";
  } catch (error) {
    //console.log("Error action deleteFile", error);
  }
}

export async function restoreFileandThread(
  profileId: string | undefined,
  fileId: string
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
    const file = await db.file.findUnique({
      where: {
        id: fileId,
      },
    });
    const thread = await db.thread.updateMany({
      where: {
        fileId: file?.id,
      },
      data: {
        toDelete: false,
      },
    });
    if (!file) {
      return "File not found";
    }
    const restoreFile = await db.file.update({
      where: {
        id: file.id,
      },
      data: {
        toDelete: false,
      },
    });
    await db.activity.create({
      data: {
        message: `File called ${file.name} and threads associated with it has been restored`,
        profileId: profile?.id as string,
      },
    });
    return "Done";
  } catch (error) {
    //console.log("Error action deleteFile", error);
  }
}

export async function permanentDeleteFileandThread(
  profileId: string | undefined,
  fileId: string
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
    const file = await db.file.findUnique({
      where: {
        id: fileId,
      },
    });
    const thread = await db.thread.deleteMany({
      where: {
        fileId: file?.id,
      },
    });
    if (!file) {
      return "File not found";
    }
    const restoreFile = await db.file.delete({
      where: {
        id: file.id,
      },
    });
    await db.activity.create({
      data: {
        message: `File ${file?.name} and threads associated with it has been permanently deleted`,
        profileId: profile?.id,
      },
    });
    return "Done";
  } catch (error) {
    //console.log("Error action deleteFile", error);
  }
}

export async function softDeleteFile(
  profileId: string | undefined,
  fileId: string
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
    await db.activity.create({
      data: {
        message: `File ${file?.name} and associated thread has been soft deleted`,
        profileId: profile?.id,
      },
    });
    return "Done";
  } catch (error) {
    //console.log("Error action deleteFile", error);
  }
}
