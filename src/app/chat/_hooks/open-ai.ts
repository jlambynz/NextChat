import { useState } from "react";
import { api } from "~/trpc/react";
import { createOptimisticReponse } from "../_components/utils";

export function useOpenAIChatMutation() {
  const [isProcessingResponse, setIsProcessingResponse] =
    useState<boolean>(false);
  const [isPendingResponse, setIsPendingResponse] = useState<boolean>(false);
  const [streamingResponse, setStreamingResponse] = useState<string>("");

  const utils = api.useUtils();
  const { mutate: sendMessage } = api.openai.sendChatMessage.useMutation({
    onMutate: ({ message }) => {
      setIsPendingResponse(true);
      createOptimisticReponse(utils, message);
    },
    onError: () => {
      setIsPendingResponse(false);
      void utils.openai.getMessages.invalidate();
    },
    onSuccess: async (responseChunks) => {
      setIsProcessingResponse(true);
      for await (const chunk of responseChunks) {
        setIsPendingResponse(false);
        setStreamingResponse((cur) => cur + chunk);
      }

      await utils.openai.getMessages.invalidate();
      setIsProcessingResponse(false);
      setStreamingResponse("");
    },
  });

  return {
    sendMessage,
    streamingResponse,
    isPendingResponse,
    isProcessingResponse,
  };
}
