import { Heading } from "@/components/heading";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import CreateThread from "./_components/create-thread";
import DeleteFile from "./_components/delete-file";
import ThreadList from "./_components/thread-list";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const profile = await currentProfile();
  const threads = await db.thread.findMany({
    where: {
      fileId: params.documentId,
      profileId: profile?.id,
      toDelete: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <>
      <div className="mb-5 flex flex-col justify-between">
        <Heading
          title="Document Id Page"
          description="Here you can create thread and delete(soft) the file. Deleting the file will result in deleting all threads associated with it."
        />
        <Heading
          title="How it works?"
          description="User enters a question --> The question is then passed to an instance of GoogleGenerativeAIEmbeddings, which embeds the question into a vector representation --> Query the vector database with the embedded question --> The query returns content that is semantically similar to the question --> The content is then used to generate a response using gemini-pro model to the user’s question."
          subdescription=""
        />
        <Heading
          title="What is a thread?"
          description="“thread” refers to a single conversation or interaction between the user and the AI."
          subdescription="In my application, user can create multiple thread for a file. I added this functionality so that different prompt can be added by the user to different threads"
        />
        <div className="flex w-full justify-between">
          <CreateThread profileId={profile?.id} fileId={params.documentId} />
          <DeleteFile
            profileId={profile?.id as string}
            fileId={params.documentId}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 mt-5">
        {threads.map((thread) => (
          <ThreadList
            key={thread.id}
            thread={thread}
            profileId={profile?.id as string}
          />
        ))}
      </div>
    </>
  );
};

export default DocumentIdPage;
