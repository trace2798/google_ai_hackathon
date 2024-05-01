import { Heading } from "@/components/heading";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { FC } from "react";
import CreateWebThread from "./_components/try-web-chat";
import WebThreadList from "./_components/web-thread-list";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const threads = await db.thread.findMany({
    where: {
      profileId: profile?.id,
      threadType: "WEB",
      toDelete: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <>
      <div>
        <Heading
          title=" Web Search"
          description="Here the content of the response is from wikipedia."
          subdescription="Using google's text-embedding-004 model to embed the content, google gemini-pro to generate answer"
        />
        <Heading
          title="How does it work?"
          description=""
          subdescription="Using google's text-embedding-004 model to embed the content, google gemini-pro to generate answer"
        />
      </div>
      <CreateWebThread profileId={profile.id} />
      <div className="grid grid-cols-1 mt-5">
        {threads.map((thread) => (
          <WebThreadList
            key={thread.id}
            thread={thread}
            profileId={profile?.id as string}
          />
        ))}
      </div>
    </>
  );
};

export default Page;
