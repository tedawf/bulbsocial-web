import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, _ and - are allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});
export type SignUpData = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: requiredString,
  password: requiredString,
});
export type LoginData = z.infer<typeof loginSchema>;
