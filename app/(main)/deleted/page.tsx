import { Heading } from "@/components/heading";
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
      <Heading
        title="Soft Deleted Activities"
        description="Here you have the option to restore or permanently delete any thread and file."
      />

      {softDeletedThreads.length === 0 && softDeletedFiles.length === 0 ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <Heading title="Nothing to permanently delete or restore" />
        </div>
      ) : null}

      <div className="grid grid-cols-1 mt-5">
        {softDeletedThreads.length > 0 && <Heading title="Threads" />}
        {softDeletedThreads.map((thread, index) => (
          <DisplayThreadComponent
            key={index}
            thread={thread}
            profileId={profile?.id as string}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 mt-5">
        {softDeletedFiles.length > 0 && <Heading title="Files" />}
        {softDeletedFiles.map((file, index) => (
          <>
            <DisplayFileComponent
              key={index}
              file={file}
              profileId={profile?.id as string}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default Page;
