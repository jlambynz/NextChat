import { api } from "~/trpc/server";
import { ChatModel } from "./chat-model";

export async function ChatSettings() {
  const [models, settings] = await Promise.all([
    api.openai.getChatModels(),
    api.openai.getChatSettings(),
  ]);

  return (
    <div className="flex flex-col gap-2">
      <ChatModel modelId={settings.model} models={models} />
    </div>
  );
}
