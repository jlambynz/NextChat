import { type RouterOutputs } from "~/trpc/react";

type Props = {
  type: RouterOutputs["openai"]["getMessages"][number]["type"];
  children: React.ReactNode;
};

export function MessageAlignment({ type, children }: Props) {
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
