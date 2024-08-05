import { TriangleAlert } from "lucide-react";
import { ChatMessageType } from "~/server/api/routers/open-ai/types";
import { type RouterOutputs } from "~/trpc/react";

type Props = {
  type?: RouterOutputs["openai"]["getChatMessages"][number]["type"];
  error?: boolean;
  children: React.ReactNode;
};

export function MessageBubble({ type, error, children }: Props) {
  function messageColorByType(
    messageType?: RouterOutputs["openai"]["getChatMessages"][number]["type"],
  ): string {
    switch (messageType) {
      case ChatMessageType.UserSent:
        return "bg-blue-700 text-white";
      case ChatMessageType.LLMResponse:
        return "bg-slate-100 text-black";
      default:
        return "bg-gray-500";
    }
  }

  const bubbleStyle = error ? "text-red-600" : messageColorByType(type);

  return (
    <div
      className={`flex flex-col items-center rounded-2xl px-3 py-2 ${bubbleStyle} max-w-[80%]`}
    >
      {error && <TriangleAlert className="mb-2 size-8 flex-shrink-0" />}
      {children}
    </div>
  );
}
