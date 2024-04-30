import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { FC } from "react";
import { format, formatRelative, subDays, toDate } from "date-fns";
import { Heading } from "@/components/heading";
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
      <div>
        <Heading
          title="Your activity"
          description="Your activities will be shown here"
        />
      </div>
      <div className="grid grid-cols-1 mt-10 space-y-3">
        {activity.map((a) => (
          <Card key={a.id} className="">
            <CardHeader>
              <CardTitle>{a.message}</CardTitle>
              <CardDescription>
                {format(new Date(a.createdAt), "yyyy-MM-dd")}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;
