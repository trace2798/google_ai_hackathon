import { Heading } from "@/components/heading";
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
      toDelete: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <>
      <Heading
        title="Your Documents"
        description="Here you can upload your document to get embedded."
        subdescription="Using google's text-embedding-004 model to embed the content and upstash vector as the vector database"
      />
      <UploadDoc />
      <div className="mt-10 mb-5">
        {files.length === 0 ? (
          <h1 className="text-xl font-bold">You have not uploaded any files</h1>
        ) : (
          <h1 className="text-xl font-bold">Your Documents</h1>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card key={file.id} className="max-w-sm w-fit">
              <CardHeader>
                <CardTitle className="font-light text-lg">
                  {file.name}
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Link href={`/documents/${file.id}`}>
                  <Button>Chat</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
