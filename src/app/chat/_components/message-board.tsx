"use client";

import { ChevronDown, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/lib/ui/button";
import { MaxWidthContainer } from "~/lib/ui/max-width-container";
import { type RouterOutputs } from "~/trpc/react";

// TODO: container overflow causes very slight misalignment of content due to the scrollbar. Would be nice to detect and adjust for this

type Props = {
  messages: RouterOutputs["openai"]["getMessages"];
  responsePending: boolean;
};

export function MessageBoard({ messages, responsePending }: Props) {
  const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
  const overflowContainerRef = useRef<HTMLDivElement>(null);

  function scrollToBottom(behavior: ScrollBehavior = "instant") {
    if (!overflowContainerRef.current) return;

    overflowContainerRef.current.scrollTo({
      top: overflowContainerRef.current.scrollHeight,
      behavior,
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!overflowContainerRef.current) return;

    const ref = overflowContainerRef.current;
    function handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = ref;
      setShowScrollDown(scrollHeight - scrollTop > clientHeight);
    }

    ref.addEventListener("scroll", handleScroll);

    return () => {
      ref.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={overflowContainerRef}
      className="flex flex-1 flex-col overflow-auto"
    >
      <MaxWidthContainer className="flex flex-1 flex-col">
        <div className="flex flex-col gap-6">
          {messages?.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {responsePending && <MessagePending type="llm-response" />}
        </div>
      </MaxWidthContainer>

      {showScrollDown && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-16 right-[50%] animate-bounce rounded-[50%]"
          onClick={() => scrollToBottom("smooth")}
        >
          <ChevronDown />
        </Button>
      )}
    </div>
  );
}

function Message({ message }: MessageProps) {
  return (
    <MessageAlignment type={message.type}>
      <MessageBubble type={message.type} error={message.status === "failed"}>
        {message.message}
      </MessageBubble>
    </MessageAlignment>
  );
}

type MessagePendingProps = {
  type: RouterOutputs["openai"]["getMessages"][number]["type"];
};

function MessagePending({ type }: MessagePendingProps) {
  return (
    <MessageAlignment type={type}>
      <div className="flex items-center space-x-2 bg-transparent px-4 py-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.3s] dark:bg-white"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.15s] dark:bg-white"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-black dark:bg-white"></div>
      </div>
    </MessageAlignment>
  );
}

type MessageBubbleProps = {
  type?: RouterOutputs["openai"]["getMessages"][number]["type"];
  error?: boolean;
  children: React.ReactNode;
};

function MessageBubble({ type, error, children }: MessageBubbleProps) {
  function messageColorByType(
    messageType?: RouterOutputs["openai"]["getMessages"][number]["type"],
  ): string {
    switch (messageType) {
      case "user-sent":
        return "bg-green-500";
      case "llm-response":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  }

  const bubbleStyle = error ? "text-red-600" : messageColorByType(type);

  return (
    <div
      className={`flex flex-col items-center rounded-2xl px-3 py-2 ${bubbleStyle} max-w-[80%] text-white`}
    >
      {error && <TriangleAlert className="mb-2 size-8 flex-shrink-0" />}
      {children}
    </div>
  );
}

type MessageAlignmentProps = {
  type: RouterOutputs["openai"]["getMessages"][number]["type"];
  children: React.ReactNode;
};

function MessageAlignment({ type, children }: MessageAlignmentProps) {
  function messageAlignment(
    messageType: RouterOutputs["openai"]["getMessages"][number]["type"],
  ): string {
    switch (messageType) {
      case "user-sent":
        return "justify-end";
      case "llm-response":
        return "justify-start";
      default:
        return "justify-start";
    }
  }

  return <div className={`flex ${messageAlignment(type)}`}>{children}</div>;
}

type MessageProps = {
  message: RouterOutputs["openai"]["getMessages"][number];
};
