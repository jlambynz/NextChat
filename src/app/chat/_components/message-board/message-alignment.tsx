import { ChatMessageType } from "~/server/api/routers/open-ai/types";
import { type RouterOutputs } from "~/trpc/react";

type Props = {
  type: RouterOutputs["openai"]["getChatMessages"][number]["type"];
  children: React.ReactNode;
};

export function MessageAlignment({ type, children }: Props) {
  function messageAlignment(
    messageType: RouterOutputs["openai"]["getChatMessages"][number]["type"],
  ): string {
    switch (messageType) {
      case ChatMessageType.UserSent:
        return "justify-end";
      case ChatMessageType.LLMResponse:
        return "justify-start";
      default:
        return "justify-start";
    }
  }

  return <div className={`flex ${messageAlignment(type)}`}>{children}</div>;
}
