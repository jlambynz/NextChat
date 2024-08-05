"use server";

import { api } from "~/trpc/server";
import { validateSettingsInput } from "./utils";
import { type RouterInputs } from "~/trpc/react";

export async function updateChatSettings(
  settings: RouterInputs["openai"]["updateChatSettings"],
) {
  // ensure input isn't manually generated or malformed
  const validatedSettings = await validateSettingsInput(settings);
  await api.openai.updateChatSettings(validatedSettings);
}
