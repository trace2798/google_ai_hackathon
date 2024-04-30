import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import Link from "next/link";
import CreateThread from "./_components/create-thread";
import DeleteFile from "./_components/delete-file";

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
      <div className="mb-5 flex justify-between">
        <div>Threads</div>
        <DeleteFile profileId={profile?.id as string} fileId={params.documentId} />
      </div>
      <CreateThread profileId={profile?.id} fileId={params.documentId} />
      <div className="grid grid-cols-1 mt-5">
        {threads.map((thread) => (
          <Link
          key={thread.id}
            prefetch={false}
            href={`/thread/${thread.id}`}
            className="hover:text-indigo-500"
          >
            <div key={thread.id} className="space-y-3 border p-3">
              {thread.title}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default DocumentIdPage;
