"use client";

import { useCompletion } from "ai/react";
import { FormEvent, useState } from "react";
import { Message, Thread } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChatMessageProps } from "./chat-message";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatForm } from "./chat-form";

interface ChatClientProps {
  thread: Thread & {
    messages: Message[];
  };
  currentUserProfileId: string;
}

export const ChatClient = ({
  thread,
  currentUserProfileId,
}: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(thread.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput, completion } =
    useCompletion({
      api: `/api/wiki/${thread.id}`,
      onFinish(_prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };
        setMessages((current) => [...current, systemMessage]);
        setInput("");
        // router.refresh();
      },
    });
  // //console.log("INPT", input);
  //console.log("COMPLETION", completion);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader currentUserProfileId={currentUserProfileId} thread={thread} />
      <ChatMessages
        thread={thread}
        isLoading={isLoading}
        messages={messages}
        completion={completion}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
