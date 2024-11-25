import type { User, UserObject } from "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT extends User {
    user: UserObject;
  }
}
