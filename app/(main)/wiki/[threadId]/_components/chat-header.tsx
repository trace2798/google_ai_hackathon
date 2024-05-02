"use client";

import { Thread } from "@prisma/client";
import {
  Edit,
  MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface ChatHeaderProps {
  thread: Thread;
  currentUserProfileId: string;
}

export const ChatHeader = ({
  thread,
  currentUserProfileId,
}: ChatHeaderProps) => {
  const router = useRouter();


  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
       
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{thread.title}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              
            </div>
          </div>
         
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
              Edit Prompt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
