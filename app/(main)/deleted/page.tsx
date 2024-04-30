import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import Link from "next/link";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const profile = await currentProfile();
  const softDeletedThreads = await db.thread.findMany({
    where: {
      profileId: profile?.id,
      toDelete: true,
    },
  });
  const softDeletedFiles = await db.file.findMany({
    where: {
      profileId: profile?.id,
      toDelete: true,
    },
  });
  return (
    <>
      <div>Deleting from here will permanently delete it.</div>
      <div className="grid grid-cols-1 mt-5">
        <h1>Threads</h1>
        {softDeletedThreads.map((thread, index) => (
          <Link
            key={index}
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
      <div className="grid grid-cols-1 mt-5">
        <h1>Files</h1>
        {softDeletedFiles.map((thread, index) => (
          <Link
            key={index}
            prefetch={false}
            href={`/thread/${thread.id}`}
            className="hover:text-indigo-500"
          >
            <div key={thread.id} className="space-y-3 border p-3">
              {thread.name}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Page;
