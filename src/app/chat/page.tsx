"use client";

import { UserInputPanel } from "./_components/user-input-panel";
import { MessageBoard } from "./_components/message-board";
import { api } from "~/trpc/react";
import { useOpenAIChatMutation } from "./_hooks/open-ai";

export default function Chat() {
  const { data: messages } = api.openai.getMessages.useQuery();
  const { sendMessage, streamingResponse, isPendingResponse } =
    useOpenAIChatMutation();

  return (
    <>
      <MessageBoard
        messages={messages ?? []}
        streamingResponse={streamingResponse}
        responsePending={isPendingResponse}
      />
      <UserInputPanel
        disabled={isPendingResponse}
        onSubmit={(message) => sendMessage({ message })}
      />
    </>
  );
}
