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

type Props = {
  imageUrl: string;
  fallback: string;
};

export function Avatar({ imageUrl, fallback }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarComponent>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </AvatarComponent>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={"/api/auth/signout"}>Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
