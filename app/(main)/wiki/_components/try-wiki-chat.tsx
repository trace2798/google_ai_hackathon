// 'use client'
// import { FC } from 'react'

// interface TryWikiChatProps {

// }

// const TryWikiChat: FC<TryWikiChatProps> = ({}) => {
//   return (<><div>TryWikiChat</div></>)
// }

// export default TryWikiChat

"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { createWikiThread } from "../action/wikiThread";

interface CreateWikiThreadProps {
  profileId: string | undefined;
}

const CreateWikiThread: FC<CreateWikiThreadProps> = ({ profileId }) => {
  const router = useRouter();
  const handleThreadCreate = async () => {
    const data = await createWikiThread(profileId);
    router.push(`/wiki/${data}`);
  };
  return (
    <>
      <div>
        <Button onClick={handleThreadCreate} variant="secondary">
          Try Wiki Chat
        </Button>
      </div>
    </>
  );
};

export default CreateWikiThread;
