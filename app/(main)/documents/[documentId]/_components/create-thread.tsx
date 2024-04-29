import { Button } from "@/components/ui/button";
import { FC } from "react";

interface CreateThreadProps {
  profileId: string | undefined;
  fileId: string;
}

const CreateThread: FC<CreateThreadProps> = ({ profileId, fileId }) => {
  return (
    <>
      <div>
        <Button variant="secondary">Create Thread</Button>
      </div>
    </>
  );
};

export default CreateThread;
