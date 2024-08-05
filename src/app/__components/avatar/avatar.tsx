import Link from "next/link";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from "~/lib/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/lib/ui/dropdown-menu";
import { SettingsMenuItem } from "./settings-menu-item";

type Props = {
  imageUrl: string;
  fallback: string;
};

export function Avatar({ imageUrl, fallback }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger name="avatar">
        <AvatarComponent>
          <AvatarImage src={imageUrl} alt="user-avatar-img" />
          <AvatarFallback>{fallback}</AvatarFallback>
        </AvatarComponent>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <SettingsMenuItem />
        <DropdownMenuItem>
          <Link href={"/api/auth/signout"}>Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
