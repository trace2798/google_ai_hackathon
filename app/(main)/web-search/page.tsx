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
          description="Here the content of the response is generated using langchain tools and gemini-1.5-pro-latest."
          subdescription="The langchain tools used in the implementation: Brave Search, Calculator and WebBrowser"
        />
        <Heading
          title="How does it work?"
          description="High Level Architecture. Explaining it in detail in my submission post."
          subdescription="User enters the input -->  initializes a set of tools (BraveSearch, Calculator, and WebBrowser) --> initializes an agent executor with these tools and the chat model  -> initializes a data stream and a LangChain stream with handlers for finalizing the stream --> starts the agent executor with the input --> server returns a streaming text response with the LangChain stream to the user"
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
