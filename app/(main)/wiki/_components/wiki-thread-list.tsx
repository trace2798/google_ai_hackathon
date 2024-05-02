"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Thread } from "@prisma/client";
import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { toast } from "sonner";
import { softDeleteWikiThread } from "../action/wikiThread";
interface WikiThreadListProps {
  thread: Thread;
  profileId: string;
}

const WikiThreadList: FC<WikiThreadListProps> = ({ thread, profileId }) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const handleSoftDeleteThread = async () => {
    try {
      setDeleting(true);
      const res = await softDeleteWikiThread(profileId, thread.id);
      //console.log(res);
      setDeleting(false);
      if (res === "Done") {
        toast.success("Thread soft deleted successfully");
        router.refresh();
      }
      if (res === "Forbidden No Profile" || res === "Unauthorized") {
        toast.error("Unauthorized");
      }
    } catch (error) {
      //console.log("ERROR IN DELETE BUTTON", error);
      toast.error("Error Deleting Thread");
    }
  };
  return (
    <>
      <div className="flex flex-row align-middle items-center justify-between space-y-3 border p-3 ">
        <div>
          <Link
            key={thread.id}
            prefetch={false}
            href={`/wiki/${thread.id}`}
            className="hover:text-indigo-500"
          >
            <div key={thread.id} className="font-satoshiMedium">
              {thread.title}
            </div>
          </Link>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size={"icon"}>
                <MoreHorizontal className="" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleSoftDeleteThread}
                className="text-red-500 hover:cursor-pointer"
                disabled={deleting}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete Thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default WikiThreadList;
