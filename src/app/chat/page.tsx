"use client";

import { MaxWidthContainer } from "~/lib/ui/max-width-container";
import { UserInput } from "./_components/user-input";
import { Messages } from "./_components/message";
import { api } from "~/trpc/react";

export default function Chat() {
  const utils = api.useUtils();

  const { data: messages } = api.openai.getMessages.useQuery();
  const { mutate } = api.openai.sendChatMessage.useMutation({
    onSuccess: async () => {
      await utils.openai.getMessages.invalidate();
    },
  });

  async function handleSubmit(message: string) {
    mutate({ message });
  }

  return (
    <>
      <div className="flex flex-1 flex-col overflow-auto">
        <MaxWidthContainer className="flex flex-1 flex-col">
          <Messages messages={messages ?? []} />
        </MaxWidthContainer>
      </div>

      <MaxWidthContainer>
        <UserInput onSubmit={handleSubmit} />
      </MaxWidthContainer>
    </>
  );
}
