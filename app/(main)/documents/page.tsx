import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import UploadDoc from "@/components/upload-doc";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import Link from "next/link";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const profile = await currentProfile();
  if (!profile) {
    await initialProfile();
  }
  const files = await db.file.findMany({
    where: {
      profileId: profile?.id,
    },
  });
  return (
    <>
      <UploadDoc />
      <div className="mt-10 mb-5">
        <h1 className="text-xl font-bold">Your Documents</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <Card key={file.id} className="max-w-sm w-fit">
            <CardHeader>
              <CardTitle className="font-light text-lg">{file.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Link href={`/document/${file.id}`}>
                <Button>Chat</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Page;
