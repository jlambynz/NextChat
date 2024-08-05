import {
  ChatMessageStatus,
  ChatMessageType,
} from "~/server/api/routers/open-ai/types";
import type { RouterOutputs, api } from "~/trpc/react";

export function createOptimisticReponse(
  trpcUtils: ReturnType<(typeof api)["useUtils"]>,
  message: string,
) {
  const previousMessages = trpcUtils.openai.getChatMessages.getData();
  trpcUtils.openai.getChatMessages.setData(undefined, () => [
    ...(previousMessages ?? []),
    {
      id: "optimistic-" + Math.random(),
      userId: "optimistic",
      message,
      type: ChatMessageType.UserSent,
      status: ChatMessageStatus.Success,
      createdAt: new Date(),
    },
  ]);

  return { previousMessages };
}

export function messageFromStreamingResponse(
  streamingResponse: string,
): RouterOutputs["openai"]["getChatMessages"][number] {
  return {
    id: "streaming-response",
    type: ChatMessageType.LLMResponse,
    status: ChatMessageStatus.Success,
    message: streamingResponse,
  };
}
