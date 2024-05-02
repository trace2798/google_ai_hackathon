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
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
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
      {/* <div className="grid grid-cols-1 mt-10 space-y-3">
        {activity.map((a) => (
          <Card key={a.id} className="">
            <CardHeader>
              <CardTitle className="font-satoshiBold text-lg">
                {a.message}
              </CardTitle>
              <CardDescription className="font-satoshiMedium">
                {format(new Date(a.createdAt), "MM-dd-yyyy HH:mm:ss")}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div> */}
      <div>
        <DataTable columns={columns} data={activity} />
      </div>
    </>
  );
};

export default Page;
