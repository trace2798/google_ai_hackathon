"use client";
import { createFileThread } from "@/actions/thread";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface CreateThreadProps {
  profileId: string | undefined;
  fileId: string;
}

const CreateThread: FC<CreateThreadProps> = ({ profileId, fileId }) => {
  const router = useRouter();
  const handleThreadCreate = async () => {
    const data = await createFileThread(profileId, fileId);
    router.push(`/thread/${data}`);
  };
  return (
    <>
      <div>
        <Button onClick={handleThreadCreate} variant="secondary">
          Create Thread
        </Button>
      </div>
    </>
  );
};

export default CreateThread;
