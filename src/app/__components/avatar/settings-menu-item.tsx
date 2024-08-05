"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DropdownMenuItem } from "~/lib/ui/dropdown-menu";
import { createQueryString } from "~/lib/utils";

export function SettingsMenuItem() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    const pathWithParam = `${pathname}${createQueryString(searchParams, "settings", "true")}`;
    router.push(pathWithParam);
  }

  return <DropdownMenuItem onClick={handleClick}>Settings</DropdownMenuItem>;
}
