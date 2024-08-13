"use client";

import { UserInputPanel } from "./_components/user-input-panel";
import { MessageBoard } from "./_components/message-board/message-board";
import { api } from "~/trpc/react";
import { useOpenAIChatMutation } from "./_hooks/open-ai";
import { useCallback } from "react";

export default function Chat() {
  const { data: messages } = api.openai.getChatMessages.useQuery();
  const {
    sendMessage,
    streamingResponse,
    isPendingResponse,
    isProcessingResponse,
  } = useOpenAIChatMutation();

  const handleMessageSubmit = useCallback(
    (message: string) => {
      sendMessage({ message });
    },
    [sendMessage],
  );

  return (
    <>
      <MessageBoard
        messages={messages ?? []}
        streamingResponse={streamingResponse}
        responsePending={isPendingResponse}
      />
      <UserInputPanel
        disabled={isPendingResponse || isProcessingResponse}
        onSubmit={handleMessageSubmit}
      />
    </>
  );
}
