"use client";

import { SendHorizonal } from "lucide-react";
import { memo, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "~/lib/ui/button";
import { MaxWidthContainer } from "~/lib/ui/max-width-container";
import { Textarea } from "~/lib/ui/textarea";

type Props = {
  disabled?: boolean;
  onSubmit: (message: string) => void;
};

function UserInputPanelComponent({ disabled = false, onSubmit }: Props) {
  const [text, setText] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text || disabled) return;

    onSubmit(text);
    setText("");
  }

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <MaxWidthContainer>
      <div className="flex w-full">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-1 items-center gap-4"
        >
          <Textarea
            autoFocus
            ref={inputRef}
            value={text}
            disabled={disabled}
            rows={1}
            placeholder="Type a message..."
            className="max-h-32 min-h-max resize-none"
            style={{
              // @ts-expect-error Experimental CSS property not available in all browsers: https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing
              // TODO: Either replace with a method more widely supported if it remains experimental for some time
              fieldSizing: "content",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => {
              inputRef.current?.focus();
            }}
          />
          <Button type="submit" name="submit-message" disabled={disabled}>
            <span className="hidden sm:block">Send</span>
            <SendHorizonal className="ml-0 size-4 sm:ml-2" />
          </Button>
        </form>
      </div>
    </MaxWidthContainer>
  );
}

export const UserInputPanel = memo(UserInputPanelComponent);
