import { Heading } from "@/components/heading";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { FC } from "react";
import { Chat } from "./_components/chat";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const currentUser = await currentProfile();
  if (!currentUser) {
    return redirectToSignIn();
  }
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
      <Chat/>
    </>
  );
};

export default Page;
