"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveRestore,
  MoreHorizontal,
  MoreVertical,
  Trash,
} from "lucide-react";
import { File } from "@prisma/client";
import {
  permanentDeleteFileandThread,
  restoreFile,
  restoreFileandThread,
} from "@/actions/file";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DisplayFileComponentProps {
  file?: File;
  profileId: string;
}

const DisplayFileComponent: FC<DisplayFileComponentProps> = ({
  file,
  profileId,
}) => {
  const router = useRouter();
  if (!file) {
    return "No file found";
  }

  const handleFileRestore = async () => {
    try {
      const response = await restoreFile(profileId, file.id);
      console.log(response);
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "File not found") {
        toast.error("File not found");
      }
      if (response === "Done") {
        toast.success("File Restored");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error Restoring File");
    }
  };

  const handleFileAndThreadRestore = async () => {
    try {
      const response = await restoreFileandThread(profileId, file.id);
      console.log(response);
      if (response === "File not found") {
        toast.error("File not found");
      }
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "Done") {
        toast.success("File and Threads Restored");
      }
      router.refresh();
    } catch (error) {
      toast.error("Error Restoring File and associated threads");
    }
  };
  const handlePermanentlyDeleteFileAndThreadRestore = async () => {
    try {
      const response = await permanentDeleteFileandThread(profileId, file.id);
      console.log(response);
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "File not found") {
        toast.error("File not found");
      }
      if (response === "Done") {
        toast.success("File and Threads permanently Deleted");
      }
      router.refresh();
    } catch (error) {
      toast.error("Error Deleting File and associated threads");
    }
  };
  return (
    <>
      <div
        key={file.id}
        className="items-center border p-3 flex justify-between"
      >
        <div>{file.name}</div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size={"icon"}>
                <MoreHorizontal className="" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleFileRestore}
                className="hover:text-green-500 hover:cursor-pointer"
              >
                <ArchiveRestore className="w-4 h-4 mr-2" />
                Restore File
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleFileAndThreadRestore}
                className="hover:text-green-500 hover:cursor-pointer"
              >
                <ArchiveRestore className="w-4 h-4 mr-2" />
                Restore File and Threads
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handlePermanentlyDeleteFileAndThreadRestore}
                className="hover:text-red-500 hover:cursor-pointer"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default DisplayFileComponent;
