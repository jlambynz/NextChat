"use client";

import { useRouter } from "next/navigation";
import { type Model } from "openai/resources/index.mjs";
import { useOptimistic, useTransition } from "react";
import { updateChatSettings } from "~/actions/chat-settings";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/ui/select";
import { Typography } from "~/lib/ui/typography";
import { useToast } from "~/lib/ui/use-toast";

type Props = {
  modelId: string;
  models: Model[];
};

export function ChatModel({ modelId, models }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedModel, setSelectedModel] = useOptimistic<string, string>(
    modelId,
    (_, newModelId) => newModelId,
  );
  const router = useRouter();
  const { toast } = useToast();

  function handleChange(newModelId: string) {
    startTransition(async () => {
      setSelectedModel(newModelId);
      try {
        await updateChatSettings({ model: newModelId });
        router.refresh();
        toast({ variant: "success", title: "Model updated" });
      } catch (e) {
        toast({ variant: "destructive", title: "Failed to update model" });
        console.error(e);
      }
    });
  }

  return (
    <div className="flex items-center justify-between">
      <Typography variant="smallText">Model</Typography>
      <Select
        value={selectedModel}
        disabled={isPending}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.id}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
