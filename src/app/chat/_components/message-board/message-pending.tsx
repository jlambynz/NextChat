import { type RouterOutputs } from "~/trpc/react";
import { MessageAlignment } from "./message-alignment";

type Props = {
  type: RouterOutputs["openai"]["getChatMessages"][number]["type"];
};

export function MessagePending({ type }: Props) {
  return (
    <MessageAlignment type={type}>
      <div className="flex items-center space-x-2 bg-transparent px-4 py-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.3s] dark:bg-white"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.15s] dark:bg-white"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-black dark:bg-white"></div>
      </div>
    </MessageAlignment>
  );
}
