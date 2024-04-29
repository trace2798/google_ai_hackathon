import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
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
          createdAt: "desc",
        },
      },
    },
  });
  const currentUser = await currentProfile()
  if(!currentUser) {
    return redirectToSignIn();
  }
  // console.log("THREAD PAGE CALL", thread);
  //   const initialChannel = server?.channels[0];

  //   if (initialChannel?.name !== "general") {
  //     return null;
  //   }
  //   console.log(Threads.length);
  return (
    <>
      {/* <h1>{Threads?.name}</h1>
      <h1>{Threads?.description}</h1>
      <h1>{Threads?.instructions}</h1> */}
      {/* <CreateThreadButton ThreadId={params.ThreadId} /> */}
      {/* <h1>{params.threadId}</h1> */}
      {thread && <ChatClient currentUserProfileId={currentUser?.id} thread={thread} />}
    </>
  );
};

export default ThreadIdPage;
