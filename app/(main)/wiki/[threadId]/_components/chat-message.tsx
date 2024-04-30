"use client";

import { Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BotAvatar } from "./bot-avatar";
import { UserAvatar } from "./user-avatar";
import ReactMarkdown from "react-markdown";

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  src?: string;
  createdAt?: Date;
}

export const ChatMessage = ({
  role,
  content,
  isLoading,
  src,
}: ChatMessageProps) => {
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard.");
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-x-3 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && src && <BotAvatar  />}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading ? (
          <BeatLoader color={theme === "light" ? "black" : "white"} size={5} />
        ) : (
          <ReactMarkdown components={{
            pre: ({ node, ...props }) => (
              <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                <pre {...props} />
              </div>
            ),
            code: ({ node, ...props }) => (
              <code className="bg-black/10 rounded-lg p-1" {...props} />
            )
          }} className="text-sm overflow-hidden leading-7">
            {content}
          </ReactMarkdown>
        )}
      </div>
      {role === "user" && <UserAvatar />}
      {role !== "user" && !isLoading && (
        <Button
          onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 transition"
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
