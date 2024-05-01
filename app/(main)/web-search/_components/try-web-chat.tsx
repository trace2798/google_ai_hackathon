

"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { createWebThread } from "../actions/webThread";

interface CreateWebThreadProps {
  profileId: string | undefined;
}

const CreateWebThread: FC<CreateWebThreadProps> = ({ profileId }) => {
  const router = useRouter();
  const handleThreadCreate = async () => {
    const data = await createWebThread(profileId);
    router.push(`/web-search/${data}`);
  };
  return (
    <>
      <div>
        <Button onClick={handleThreadCreate} variant="secondary">
          Try Web Chat
        </Button>
      </div>
    </>
  );
};

export default CreateWebThread;
