import { api } from "~/trpc/server";
import { ChatModel } from "./chat-model";
import { ClearChatHistory } from "./clear-chat-history";

export async function ChatSettings() {
  const [models, settings] = await Promise.all([
    api.openai.getChatModels(),
    api.openai.getChatSettings(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <ChatModel modelId={settings.model} models={models} />
      <ClearChatHistory />
    </div>
  );
}
