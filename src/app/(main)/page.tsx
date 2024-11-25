import LogoutButton from "@/components/LogoutButton";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { permanentRedirect } from "next/navigation";

export default async function Page() {
  const data: Session | null = await auth();
  console.log(`session: ${JSON.stringify(data)}`);
  if (!data?.user) {
    permanentRedirect("/login");
  }

  return (
    <main>
      <h1>{JSON.stringify(data?.user)}</h1>
      <LogoutButton />
    </main>
  );
}
