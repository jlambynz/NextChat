import { type RouterOutputs } from "~/trpc/react";
import { MessageAlignment } from "./message-alignment";
import { memo } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatMessageStatus } from "~/server/api/routers/open-ai/types";

type Props = {
  message: RouterOutputs["openai"]["getChatMessages"][number];
};

function MessageComponent({ message }: Props) {
  return (
    <MessageAlignment type={message.type}>
      <MessageBubble
        type={message.type}
        error={message.status === ChatMessageStatus.Failed}
      >
        {message.message}
      </MessageBubble>
    </MessageAlignment>
  );
}

export const Message = memo(MessageComponent);
