import { db } from "@/lib/db";
import { FC } from "react";

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
  if(!thread) {
    return null
  }
  return (
    <>
      <div>
        <h1>Edit Thread</h1>
        <p>Current Prompt: {thread.prompt}</p>
      </div>
    </>
  );
};

export default Page;
