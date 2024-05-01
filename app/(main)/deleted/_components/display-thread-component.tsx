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
import { permanentlyDeleteThreadAction, restoreThread } from "@/actions/thread";
import { useRouter } from "next/navigation";
import {
  permanentlyDeleteWikiThreadAction,
  restoreWikiThread,
} from "../../wiki/action/wikiThread";
import { permanentlyDeleteWebThreadAction, restoreWebThread } from "../../web-search/actions/webThread";

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
  const router = useRouter();
  const handleRestoreThread = async () => {
    try {
      const response = await restoreThread(profileId, thread.id);
      console.log(response);
      if (response === "You need to restore the file to restore this thread") {
        toast.error(
          "File associated with this thread needs to be restored first"
        );
      }
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "Done") {
        toast.success("Thread Restored");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error Restoring Thread");
    }
  };

  const handleRestoreWikiThread = async () => {
    try {
      const response = await restoreWikiThread(profileId, thread.id);
      console.log(response);
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "Done") {
        toast.success("Thread Restored");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error Restoring Thread");
    }
  };

  const handleRestoreWebThread = async () => {
    try {
      const response = await restoreWebThread(profileId, thread.id);
      console.log(response);
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "Done") {
        toast.success("Thread Restored");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error Restoring Thread");
    }
  };

  const permanentlyDeleteThread = async () => {
   
    try {
      const response = await permanentlyDeleteThreadAction(
        profileId,
        thread.id
      );
      console.log(response);
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "File not found") {
        toast.error("File not found");
      }
      if (response === "Done") {
        toast.success("Thread Restored");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error Restoring Thread");
    }
  };

  const permanentlyDeleteWikiThread = async () => {
    try {
      const response = await permanentlyDeleteWikiThreadAction(
        profileId,
        thread.id
      );
      console.log(response);
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "Done") {
        toast.success("Thread Permanently Deleted");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error Permanently Deleting Thread");
    }
  };

  const permanentlyDeleteWebThread = async () => {
    try {
      const response = await permanentlyDeleteWebThreadAction(
        profileId,
        thread.id
      );
      console.log(response);
      if (response === "Unauthorized") {
        toast.error("Unauthorized");
      }
      if (response === "Done") {
        toast.success("Thread Permanently Deleted");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error Permanently Deleting Thread");
    }
  };
  return (
    <>
      <div
        key={thread.id}
        className="items-center border p-3 flex justify-between"
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
              {thread.threadType === "WIKI" && (
                <DropdownMenuItem
                  onClick={handleRestoreWikiThread}
                  className="text-green-500 hover:cursor-pointer"
                >
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore Wiki Thread
                </DropdownMenuItem>
              )}
              {thread.threadType === "WEB" && (
                <DropdownMenuItem
                  onClick={handleRestoreWebThread}
                  className="text-green-500 hover:cursor-pointer"
                >
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore Web Thread
                </DropdownMenuItem>
              )}
              {thread.threadType === "DOC" && (
                <DropdownMenuItem
                  onClick={handleRestoreThread}
                  className="text-green-500 hover:cursor-pointer"
                >
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore Document Thread
                </DropdownMenuItem>
              )}
              {thread.threadType === "WIKI" && (
                <DropdownMenuItem
                  onClick={permanentlyDeleteWikiThread}
                  className="text-red-500 hover:cursor-pointer"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
               {thread.threadType === "WEB" && (
                <DropdownMenuItem
                  onClick={permanentlyDeleteWebThread}
                  className="text-red-500 hover:cursor-pointer"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
              {thread.threadType === "DOC" && (
                <DropdownMenuItem
                  onClick={permanentlyDeleteThread}
                  className="text-red-500 hover:cursor-pointer"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default DisplayThreadComponent;
