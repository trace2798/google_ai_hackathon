"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { Thread } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "./chat-message";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  // companion: Companion
  thread: Thread;
  completion: string;
}

export const ChatMessages = ({
  messages = [],
  isLoading,
  thread,
  completion,
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<"div">>(null);

  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        role="system"
        content={`Hello, I am a Google Gemini powered AI assistant. I can help you by finding information from Wikipedia.`}
      />
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          content={message.content}
          role={message.role}
        />
      ))}
      {isLoading && (
        <ChatMessage
          role="system"
          content={completion || "Generating your response..."}
        />
      )}
      <div ref={scrollRef} />
    </div>
  );
};
