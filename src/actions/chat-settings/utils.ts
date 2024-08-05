import { type RouterInputs } from "~/trpc/react";
import { api } from "~/trpc/server";

export async function validateSettingsInput(
  input: unknown,
): Promise<RouterInputs["openai"]["updateChatSettings"]> {
  if (!isUpdateSettingsInput(input)) {
    throw new Error("Malformed settings");
  }

  if (input.model) {
    const supportedModels = await api.openai.getChatModels();
    if (!supportedModels.some((model) => model.id === input.model)) {
      throw new Error("Invalid model");
    }
  }

  return input;
}

function isUpdateSettingsInput(
  input: unknown,
): input is RouterInputs["openai"]["updateChatSettings"] {
  return typeof input === "object" && !!input && "model" in input;
}
