"use client";

import { ChevronDown } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Button } from "~/lib/ui/button";
import { MaxWidthContainer } from "~/lib/ui/max-width-container";
import { type RouterOutputs } from "~/trpc/react";
import { messageFromStreamingResponse } from "../utils";
import { Message } from "./message";
import { MessagePending } from "./message-pending";

// TODO: container overflow causes very slight misalignment of content due to the scrollbar. Would be nice to detect and adjust for this

type Props = {
  messages: RouterOutputs["openai"]["getMessages"];
  streamingResponse: string;
  responsePending: boolean;
};

function MessageBoardComponent({
  messages,
  streamingResponse,
  responsePending,
}: Props) {
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
  }, [messages, streamingResponse]);

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
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {responsePending && <MessagePending type="llm-response" />}

          {streamingResponse && (
            <Message
              message={messageFromStreamingResponse(streamingResponse)}
            />
          )}
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

export const MessageBoard = memo(MessageBoardComponent);
