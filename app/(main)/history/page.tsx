import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const profile = await currentProfile();
  const activity = await db.activity.findMany({
    where: {
      profileId: profile?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      <div>History and activity will be shown here</div>
      {activity.map((a) => (
        <div key={a.id}>{a.message}</div>
      ))}
    </>
  );
};

export default Page;
