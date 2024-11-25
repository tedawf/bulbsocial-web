"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginData, loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, SignInResponse } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoadingButton from "../LoadingButton";
import { PasswordInput } from "./PasswordInput";

export default function LoginForm() {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  async function onSubmit(data: LoginData) {
    setIsLoading(true);
    const result: SignInResponse | undefined = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.status === 401) {
      // If there is an error, update the state to display the error message
      setError("Invalid credentials");
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      {error && <p className="text-center text-destructive">{error}</p>}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton loading={isLoading} type="submit" className="w-full">
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
}
