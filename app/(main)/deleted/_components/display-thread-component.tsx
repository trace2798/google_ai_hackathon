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
import { Thread } from "@prisma/client";
import { toast } from "sonner";
import { restoreThread } from "@/actions/restoreThread";

interface DisplayThreadComponentProps {
  thread?: Thread;
  profileId: string;
}

const DisplayThreadComponent: FC<DisplayThreadComponentProps> = ({
  thread,
  profileId,
}) => {
  if (!thread) {
    return "No thread found";
  }
  const handleRestoreThread = async () => {
    try {
      const response = await restoreThread(profileId, thread.id);
      console.log(response);
      if (response === "You need to restore the file to restore this thread") {
        toast.error(
          "File associated with this thread needs to be restored first"
        );
      }
      if(response === "Unauthorized"){
        toast.error("Unauthorized");
      }
      if (response === "Done") {
        toast.success("Thread Restored");
      }
    } catch (error) {
      toast.error("Error Restoring Thread");
    }
  };
  return (
    <>
      <div
        key={thread.id}
        className="space-y-3 border p-3 flex justify-between"
      >
        <div>{thread.title}</div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRestoreThread}>
                <ArchiveRestore className="w-4 h-4 mr-2" />
                Restore Thread
              </DropdownMenuItem>
              <DropdownMenuItem
              // onClick={onDelete}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* {currentUserProfileId === thread.profileId && (
      
      )} */}
    </>
  );
};

export default DisplayThreadComponent;
