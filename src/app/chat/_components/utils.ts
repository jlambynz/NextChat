import { type api } from "~/trpc/react";

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
