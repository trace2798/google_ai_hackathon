"use client";
import { deleteFile } from "@/actions/deleteFile";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "sonner";

interface DeleteFileProps {
  profileId: string;
  fileId: string;
}

const DeleteFile: FC<DeleteFileProps> = ({ profileId, fileId }) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const handleClick = async () => {
    try {
      setDeleting(true);
      const res = await deleteFile(profileId, fileId);
      console.log(res);
      setDeleting(false);
      if (res === "Done") {
        toast.success("File deleted successfully");
        router.push("/documents");
        router.refresh()
      }
      if (res === "Forbidden No Profile" || res === "Unauthorized") {
        toast.error("Unauthorized");
      }
    } catch (error) {
      console.log("ERROR IN DELETE BUTTON", error);
      toast.error("Error Deleting File");
    }
  };
  return (
    <>
      <div>
        <Button disabled={deleting} onClick={handleClick} variant="destructive">
          Delete file
        </Button>
      </div>
    </>
  );
};

export default DeleteFile;
