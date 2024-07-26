import Link from "next/link";
import { Button } from "~/lib/ui/button";
import { Typography } from "~/lib/ui/typography";
import { Avatar } from "./avatar";
import { getServerAuthSession } from "~/server/auth";

export async function TopNav() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex w-full border-b-2 p-4">
      <div className="max-w-8xl mx-auto flex w-full justify-between">
        <Typography variant="h1" as="h1">
          Next Chat
        </Typography>

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
    </nav>
  );
}
