import { Heading } from "@/components/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { format } from "date-fns";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const files = await db.file.count({
    where: {
      profileId: profile?.id,
    },
  });
  const messages = await db.message.count({
    where: {
      profileId: profile?.id,
      role: "user",
    },
  });
  const messagesSystem = await db.message.count({
    where: {
      profileId: profile?.id,
      role: "system",
    },
  });
  const successRate = (messagesSystem / messages) * 100;
  return (
    <>
      <div>
        <Heading
          title="Acount Settings"
          description="Here you can check you profile info"
        />
        <Separator className="mb-5" />
        <div className="flex justify-between">
          <div>
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Profile Info</CardTitle>
                <CardDescription>Id: {profile.id}</CardDescription>
              </CardHeader>
              <CardContent className="">
                <h1>
                  <span className="text-muted-foreground">Name: </span>
                  {profile.name}
                </h1>
                <h1>
                  <span className="text-muted-foreground">Email: </span>
                  {profile.email}
                </h1>
                <h1>
                  <span className="text-muted-foreground">
                    Profile Created:
                  </span>{" "}
                  {format(
                    new Date(profile.createdAt),
                    "MMMM d, yyyy 'at' HH:mm:ss"
                  )}
                </h1>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Usage Info</CardTitle>
              </CardHeader>
              <CardContent className="">
                <h1>
                  <span className="text-muted-foreground">File Added: </span>
                  {files}
                </h1>
                <h1>
                  <span className="text-muted-foreground">Message Sent: </span>
                  {messages}
                </h1>
                <h1>
                  <span className="text-muted-foreground">
                    Message Received:
                  </span>{" "}
                  {messagesSystem}
                </h1>
                <h1>
                  <span className="text-muted-foreground">Success Rate:</span>{" "}
                  {successRate.toFixed(0)}%
                </h1>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
