import { type HTMLProps } from "react";
import { cn } from "../utils";

export function MaxWidthContainer({
  className,
  children,
  ...rest
}: HTMLProps<HTMLDivElement> & { sizes?: "sm" | "md" }) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-5xl p-4", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
