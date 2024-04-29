import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { FC } from "react";
import CreateThread from "./_components/create-thread";
import Link from "next/link";

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
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <>
      <div className="mb-5">Threads</div>
      <CreateThread profileId={profile?.id} fileId={params.documentId} />
      <div className="grid grid-cols-1 mt-5">
        {threads.map((thread) => (
          <Link prefetch={false} href={`/thread/${thread.id}`} className="hover:text-indigo-500">
            <div key={thread.id} className="space-y-3">
              {thread.title}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default DocumentIdPage;
