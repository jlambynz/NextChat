"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/lib/ui/dialog";
import { Separator } from "~/lib/ui/separator";
import { removeQueryString } from "~/lib/utils";

type Props = {
  children: React.ReactNode;
};

export function SettingsDialogRouter({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleClose() {
    const withoutSettingsParam = `${pathname}${removeQueryString(searchParams, "settings")}`;
    router.push(withoutSettingsParam);
  }

  return (
    <Dialog open={!!searchParams.get("settings")} onOpenChange={handleClose}>
      <DialogContent
        className="gap-2 p-0 sm:max-w-[425px]"
        aria-describedby={undefined}
      >
        <DialogHeader className="p-4">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="p-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
