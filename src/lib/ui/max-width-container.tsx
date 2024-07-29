import { type HTMLProps } from "react";
import { cn } from "../utils";

export function MaxWidthContainer({
  className,
  children,
  ...rest
}: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-8xl p-4", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
