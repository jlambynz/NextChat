import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center text-white">
        {session && `Hello ${session.user.name}`}
      </main>
    </HydrateClient>
  );
}
