import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { FC } from "react";
import DisplayFileComponent from "./_components/display-file-component";
import DisplayThreadComponent from "./_components/display-thread-component";

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
          <DisplayThreadComponent
            key={index}
            thread={thread}
            profileId={profile?.id as string}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 mt-5">
        <h1>Files</h1>
        {softDeletedFiles.map((file, index) => (
          <>
            <DisplayFileComponent key={index} file={file} profileId={profile?.id as string} />
          </>
        ))}
      </div>
    </>
  );
};

export default Page;
