import { db } from "@/lib/db";
import { FC } from "react";
import EditPrompt from "./_components/edit-prompt";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: {
    threadId: string;
  };
}

const Page: FC<PageProps> = async ({ params }) => {
  console.log("Pathname: ", params.threadId);
  const thread = await db.thread.findUnique({
    where: {
      id: params.threadId,
    },
  });
  console.log(thread);
  if (!thread) {
    return null;
  }
  return (
    <>
      <div>
        <Heading title="Edit Thread Prompt" />
        <Separator className="mb-5" />
        <p className="mb-5">Current Prompt: {thread.prompt}</p>
        <EditPrompt thread={thread} />
      </div>
    </>
  );
};

export default Page;
