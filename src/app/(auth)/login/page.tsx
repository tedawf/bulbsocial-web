import loginImage from "@/assets/login-image.jpg";
import LoginForm from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  const data: Session | null = await auth();
  console.log(`session: ${JSON.stringify(data)}`)
  if (data?.user) {
    permanentRedirect("/");
  }

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Login to BulbSocial</h1>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account yet? Sign up
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
