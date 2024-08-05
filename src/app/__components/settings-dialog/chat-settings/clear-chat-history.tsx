"use client";

import { useState, useTransition } from "react";
import { clearChatHistory } from "~/actions/chat-settings/chat-settings";
import { Button } from "~/lib/ui/button";
import { Typography } from "~/lib/ui/typography";
import { useToast } from "~/lib/ui/use-toast";
import { api } from "~/trpc/react";

export function ClearChatHistory() {
  const [requireConfirmation, setRequireConfirmation] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const utils = api.useUtils();

  async function onConfirm() {
    startTransition(async () => {
      try {
        await clearChatHistory();
        await utils.openai.getChatMessages.invalidate();
        toast({ variant: "success", title: "Chat history cleared" });
        setRequireConfirmation(false);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Failed to clear chat history",
        });
        console.error(e);
      }
    });
  }

  return (
    <div className="flex items-center justify-between">
      <Typography variant="smallText">Clear chat history</Typography>
      {!requireConfirmation && (
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={() => setRequireConfirmation(true)}
        >
          Clear
        </Button>
      )}
      {requireConfirmation && (
        <div className="flex flex-col items-center gap-2">
          <Typography variant="mutedText">Are you sure?</Typography>
          <div className="flex gap-4">
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={onConfirm}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => setRequireConfirmation(false)}
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
