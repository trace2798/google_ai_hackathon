import { Heading } from "@/components/heading";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { FC } from "react";
import CreateWikiThread from "./_components/try-wiki-chat";
import { db } from "@/lib/db";
import ThreadList from "../documents/[documentId]/_components/thread-list";
import WikiThreadList from "./_components/wiki-thread-list";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const threads = await db.thread.findMany({
    where: {
      profileId: profile?.id,
      threadType: "WIKI",
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
          title="Search Wikipedia"
          description="Here the content of the response is from wikipedia."
          subdescription="Using google's text-embedding-004 model to embed the content, google gemini-pro to generate answer"
        />
        <Heading
          title="How does it work?"
          description=""
          subdescription="Using google's text-embedding-004 model to embed the content, google gemini-pro to generate answer"
        />
      </div>
      <CreateWikiThread profileId={profile.id} />
      <div className="grid grid-cols-1 mt-5">
        {threads.map((thread) => (
          <WikiThreadList
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
