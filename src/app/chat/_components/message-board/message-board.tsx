"use client";

import { memo } from "react";
import { MaxWidthContainer } from "~/lib/ui/max-width-container";
import { type RouterOutputs } from "~/trpc/react";
import { messageFromStreamingResponse } from "../utils";
import { Message } from "./message";
import { MessagePending } from "./message-pending";
import { ChatMessageType } from "~/server/api/routers/open-ai/types";
import { MessageBoardContainer } from "./message-board-container";

// TODO: container overflow causes very slight misalignment of content due to the scrollbar. Would be nice to detect and adjust for this

type Props = {
  messages: RouterOutputs["openai"]["getChatMessages"];
  streamingResponse: string;
  responsePending: boolean;
};

function MessageBoardComponent({
  messages,
  streamingResponse,
  responsePending,
}: Props) {
  return (
    <MessageBoardContainer>
      <MaxWidthContainer className="flex flex-1 flex-col">
        <div className="flex flex-col gap-6">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {responsePending && (
            <MessagePending type={ChatMessageType.LLMResponse} />
          )}

          {streamingResponse && (
            <Message
              message={messageFromStreamingResponse(streamingResponse)}
            />
          )}
        </div>
      </MaxWidthContainer>
    </MessageBoardContainer>
  );
}

export const MessageBoard = memo(MessageBoardComponent);
