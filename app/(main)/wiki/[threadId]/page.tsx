import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Chat } from "../_components/chat";
import { ChatClient } from "./_components/chat-client";

interface ThreadIdPageProps {
  params: {
    threadId: string;
  };
}

const ThreadIdPage = async ({ params }: ThreadIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const thread = await db.thread.findUnique({
    where: {
      id: params.threadId,
    },
    include: {
      messages: {
        where: {
          profileId: profile.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  const currentUser = await currentProfile();
  if (!currentUser) {
    return redirectToSignIn();
  }
  return <>{thread && <ChatClient currentUserProfileId={currentUser?.id} thread={thread} />}</>;
};

export default ThreadIdPage;
