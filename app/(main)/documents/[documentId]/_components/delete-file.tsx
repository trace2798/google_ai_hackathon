"use client";
import { deleteFile } from "@/actions/deleteFile";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { FC } from "react";

interface DeleteFileProps {
  profileId: string | undefined;
  fileId: string;
}

const DeleteFile: FC<DeleteFileProps> = ({ profileId, fileId }) => {
  const handleClick = async () => {
    await deleteFile(profileId, fileId);
  };
  return (
    <>
      <div>
        <Button onClick={handleClick} variant="destructive">
          Delete file
        </Button>
      </div>
    </>
  );
};

export default DeleteFile;
