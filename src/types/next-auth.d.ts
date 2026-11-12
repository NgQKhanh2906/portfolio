import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      githubId: number;
      username: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    github_id?: number;
    username?: string;
    is_admin?: boolean;
  }
}
