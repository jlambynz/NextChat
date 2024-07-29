import Link from "next/link";
import { Button } from "~/lib/ui/button";
import { Typography } from "~/lib/ui/typography";
import { Avatar } from "./avatar";
import { getServerAuthSession } from "~/server/auth";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { MaxWidthContainer } from "~/lib/ui/max-width-container";

export async function TopNav() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex w-full border-b-2">
      <MaxWidthContainer className="justify-between">
        <Typography variant="h1" as="h1">
          Next Chat
        </Typography>

        <div className="flex gap-4">
          <ThemeModeToggle />

          {session?.user ? (
            <Avatar
              imageUrl={session.user.image ?? ""}
              fallback={session.user.name?.[0] ?? "?"}
            />
          ) : (
            <Button asChild>
              <Link href={"/api/auth/signin"}>Sign in</Link>
            </Button>
          )}
        </div>
      </MaxWidthContainer>
    </nav>
  );
}
