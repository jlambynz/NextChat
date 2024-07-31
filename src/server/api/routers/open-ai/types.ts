export type ChatMessageType = "user-sent" | "llm-response";
export type ChatMessageStatus = "success" | "failed";

export type ChatMessage = {
  id: string;
  type: ChatMessageType;
  status: ChatMessageStatus;
  message: string;
};
