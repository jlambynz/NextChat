import { type RouterOutputs } from "~/trpc/react";
import { MessageAlignment } from "./message-alignment";
import { memo } from "react";
import { MessageBubble } from "./message-bubble";

type Props = {
  message: RouterOutputs["openai"]["getMessages"][number];
};

function MessageComponent({ message }: Props) {
  return (
    <MessageAlignment type={message.type}>
      <MessageBubble type={message.type} error={message.status === "failed"}>
        {message.message}
      </MessageBubble>
    </MessageAlignment>
  );
}

export const Message = memo(MessageComponent);
