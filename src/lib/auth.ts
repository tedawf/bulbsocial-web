import { jwtDecode } from "jwt-decode";
import NextAuth, { Session, User } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { LoginData } from "./validation";

async function customAuth(
  credentials: Partial<Record<"email" | "password", unknown>>,
) {
  try {
    const creds: LoginData = {
      email: credentials.email as string,
      password: credentials.password as string,
    };

    const response = await fetch(`${process.env.BACKEND_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    });

    if (response.ok) {
      return await response.json();
    } else {
      // Return null if authentication fails
      return null;
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      authorize: async (credentials) => {
        // Fetch user from your API
        const result = await customAuth(credentials);

        if (result) {
          const decoded: DefaultJWT = jwtDecode(result.data);
          const user = {
            access: result.data,
            exp: decoded.exp,
            user: {
              id: decoded.sub?.toString(),
            },
          } as User;

          // Any user object returned here will be set in the session for the user
          return Promise.resolve(user);
        } else {
          // If the credentials are invalid, return null
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (token.exp && token.exp < currentTime) {
        // Return an empty session to force a logout
        return {} as Session;
      }
      // Attach the user information to the session
      session.user = token.user;
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    error: "/login",
    signIn: "/login",
  },
});
