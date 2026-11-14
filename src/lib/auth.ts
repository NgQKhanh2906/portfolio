import "server-only";
import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export interface GitHubProfileData {
  id: number;
  login: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  [key: string]: unknown;
}

export function mapGitHubProfile(profile: GitHubProfileData) {
  const adminGithubId = process.env.ADMIN_GITHUB_ID;
  const isAdmin = Boolean(
    adminGithubId && String(profile.id) === String(adminGithubId),
  );

  return {
    id: String(profile.id),
    name: profile.name ?? profile.login,
    email: profile.email ?? null,
    image: profile.avatar_url ?? null,
    githubId: profile.id,
    username: profile.login,
    isAdmin,
  };
}

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  } as never),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile: (profile) =>
        mapGitHubProfile(profile as unknown as GitHubProfileData),
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session?.user) {
        if (user) {
          session.user.id = user.id;
          const u = user as unknown as {
            githubId?: number;
            github_id?: number;
            username?: string;
            isAdmin?: boolean;
            is_admin?: boolean;
          };
          session.user.githubId = u.githubId ?? u.github_id ?? 0;
          session.user.username = u.username ?? "";
          session.user.isAdmin = Boolean(u.isAdmin ?? u.is_admin ?? false);
        } else if (token) {
          if (token.sub) session.user.id = token.sub;
          if (token.githubId) session.user.githubId = token.githubId as number;
          if (token.username) session.user.username = token.username as string;
          if (typeof token.isAdmin === "boolean") {
            session.user.isAdmin = token.isAdmin;
          }
        }
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
