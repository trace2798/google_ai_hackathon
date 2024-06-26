"use client";

import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { useTheme } from "next-themes";
import { ElementRef, useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
// import { EmptyStateAI } from "./empty";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
// interface ChatProps {
//   fileId: string;
//   pastMessages: Message[] as any;
//   userId: string;
// }

export const Chat = ({}) => {
  const router = useRouter();
  const {
    input,
    handleInputChange,
    handleSubmit,
    data,
    isLoading,
    setInput,
    append,
    messages,
  } = useChat({
    api: `/api/wiki`,
    // onResponse: router.refresh,
    onResponse(response) {
      if (response.status === 401) {
        toast.error("Error precessing request");
      }
      // router.refresh();
      // // //console.log(response.body?.getReader());
    },
    // onFinish: router.refresh,
  });
  const { theme } = useTheme();

  const scrollRef = useRef<ElementRef<"div">>(null);
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  //   const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  //   const onCopy = (content: string) => {
  //     if (isCopied) return;
  //     copyToClipboard(content);
  //     toast({
  //       description: "Content copied",
  //       duration: 3000,
  //     });
  //   };

  return (
    <div className="flex flex-col w-full max-w-xl pb-24 mx-auto stretch min-h-screen">
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn("whitespace-pre-wrap group", {
            "text-blue-500 text-right p-4  gap-x-8 rounded-lg max-w-lg ":
              m.role === "user",
            "text-green-500 p-4 w-full flex items-start gap-x-8 rounded-lg max-w-lg bg-muted":
              m.role !== "user",
          })}
        >
          {m.role === "user" ? (
            ""
          ) : (
            <Button
              //   onClick={() => onCopy(m.content)}
              className="hidden group-hover:block"
              size="icon"
              variant="ghost"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => (
                <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                  <pre {...props} />
                </div>
              ),
              code: ({ node, ...props }) => (
                <code className="bg-black/10 rounded-lg p-1" {...props} />
              ),
            }}
            className="text-sm overflow-hidden "
          >
            {m.content}
          </ReactMarkdown>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        {isLoading && (
          <div className="p-4 rounded-lg w-1/2 flex items-center justify-center bg-muted mt-10">
            <BeatLoader
              color={theme === "light" ? "black" : "white"}
              size={5}
            />
          </div>
        )}

        <Input
          className="fixed bottom-0 w-[80vw] md:w-full max-w-md p-2 mb-8 min-h-4 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Talk to the document..."
          onChange={handleInputChange}
        />
        <div ref={scrollRef} />
      </form>
    </div>
  );
};
