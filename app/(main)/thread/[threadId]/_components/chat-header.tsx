"use client";

import { Thread } from "@prisma/client";
import axios from "axios";
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { BotAvatar } from "./bot-avatar";

interface ChatHeaderProps {
  // companion: Companion;
  thread: Thread;
  currentUserProfileId: string;
}

export const ChatHeader = ({
  thread,
  currentUserProfileId,
}: ChatHeaderProps) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      // await axios.delete(`/api/companion/${companion.id}`);
      // toast.success("Companion deleted.");
      router.refresh();
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button onClick={() => router.back()} size="icon" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <BotAvatar />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{thread.title}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="w-3 h-3 mr-1" />
              {/* {companion._count.messages} */}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Created by</p>
        </div>
      </div>
      {currentUserProfileId === thread.profileId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/thread/${thread.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
