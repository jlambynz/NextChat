import { type RouterOutputs } from "~/trpc/react";

type MessagesProps = {
  messages: RouterOutputs["openai"]["getMessages"];
};

export function Messages({ messages }: MessagesProps) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}

export function Message({ message }: MessageProps) {
  return (
    <div className={`flex ${messageAlignment(message.type)} gap-2`}>
      <div
        className={`flex items-center rounded-2xl px-3 py-2 ${messageColor(message.type)} max-w-[80%] text-white`}
      >
        {message.message}
      </div>
    </div>
  );
}

function messageColor(
  messageType: RouterOutputs["openai"]["getMessages"][number]["type"],
): string {
  switch (messageType) {
    case "user-sent":
      return "bg-green-500";
    case "llm-response":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

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

type MessageProps = {
  message: RouterOutputs["openai"]["getMessages"][number];
};
