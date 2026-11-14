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
    id?: string;
    githubId?: number;
    username?: string;
    isAdmin?: boolean;
    github_id?: number;
    is_admin?: boolean;
  }
}

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      githubId: number;
      username: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    githubId?: number;
    username?: string;
    isAdmin?: boolean;
    github_id?: number;
    is_admin?: boolean;
  }
}
