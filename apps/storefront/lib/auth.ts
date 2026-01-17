import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { ADMIN_USERNAME } from "@/lib/constants";

if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET or AUTH_SECRET must be set in environment variables");
}

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Only allow admin user to login
          if (credentials.email !== ADMIN_USERNAME) {
            return null;
          }

          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, ADMIN_USERNAME))
            .limit(1);

          if (user.length === 0 || !user[0].password) {
            return null;
          }

          const userPassword: string = String(user[0].password);
          const inputPassword: string = String(credentials.password);
          const isValidPassword = await bcrypt.compare(
            inputPassword,
            userPassword
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: String(user[0].id),
            email: user[0].email || ADMIN_USERNAME,
            name: user[0].name || "Admin",
            image: user[0].image || null,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Helper function to get current user
export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user;
  } catch (error) {
    return null;
  }
}
