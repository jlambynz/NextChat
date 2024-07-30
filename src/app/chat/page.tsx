"use client";

import { UserInputPanel } from "./_components/user-input-panel";
import { MessageBoard } from "./_components/message-board";
import { api } from "~/trpc/react";
import { createOptimisticReponse } from "./_components/utils";

export default function Chat() {
  const utils = api.useUtils();

  const { data: messages } = api.openai.getMessages.useQuery();
  const { mutate: sendMessage, isPending: responsePending } =
    api.openai.sendChatMessage.useMutation({
      onMutate: async ({ message }) => createOptimisticReponse(utils, message),
      onSettled: () => utils.openai.getMessages.invalidate(),
    });

  return (
    <>
      <MessageBoard
        messages={messages ?? []}
        responsePending={responsePending}
      />
      <UserInputPanel
        responsePending={responsePending}
        onSubmit={(message) => sendMessage({ message })}
      />
    </>
  );
}
