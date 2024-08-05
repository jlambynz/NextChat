export enum ChatMessageType {
  UserSent = "user-sent",
  LLMResponse = "llm-response",
}
export enum ChatMessageStatus {
  Success = "success",
  Failed = "failed",
}

export type ChatMessage = {
  id: string;
  type: ChatMessageType;
  status: ChatMessageStatus;
  message: string;
};
