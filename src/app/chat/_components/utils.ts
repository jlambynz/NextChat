import type { RouterOutputs, api } from "~/trpc/react";

export function createOptimisticReponse(
  trpcUtils: ReturnType<(typeof api)["useUtils"]>,
  message: string,
) {
  const previousMessages = trpcUtils.openai.getMessages.getData();
  trpcUtils.openai.getMessages.setData(undefined, () => [
    ...(previousMessages ?? []),
    {
      id: "optimistic-" + Math.random(),
      userId: "optimistic",
      message,
      type: "user-sent",
      status: "success",
      createdAt: new Date(),
    },
  ]);

  return { previousMessages };
}

export function messageFromStreamingResponse(
  streamingResponse: string,
): RouterOutputs["openai"]["getMessages"][number] {
  return {
    id: "streaming-response",
    type: "llm-response",
    status: "success",
    message: streamingResponse,
  };
}
