import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: { GET: vi.fn(), POST: vi.fn() },
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}));

vi.mock("@auth/drizzle-adapter", () => ({
  DrizzleAdapter: vi.fn(() => ({})),
}));

import { mapGitHubProfile, authConfig } from "@/lib/auth";
import { SignInButton } from "@/components/guestbook/sign-in-button";
import { SignOutButton } from "@/components/guestbook/sign-out-button";
import { signIn, signOut } from "next-auth/react";
import type { Session, User } from "next-auth";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
}));

describe("TASK-17: Auth.js GitHub Profile Mapping & Admin Permission", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("mapGitHubProfile", () => {
    it("maps GitHub profile attributes to user schema accurately", () => {
      process.env.ADMIN_GITHUB_ID = "99999999";

      const profile = {
        id: 1234567,
        login: "octocat",
        name: "The Octocat",
        email: "octocat@github.com",
        avatar_url: "https://avatars.githubusercontent.com/u/1234567?v=4",
      };

      const mapped = mapGitHubProfile(profile);

      expect(mapped).toEqual({
        id: "1234567",
        name: "The Octocat",
        email: "octocat@github.com",
        image: "https://avatars.githubusercontent.com/u/1234567?v=4",
        githubId: 1234567,
        username: "octocat",
        isAdmin: false,
      });
    });

    it("falls back to username when name is not provided in profile", () => {
      const profile = {
        id: 7654321,
        login: "developer",
        name: null,
        email: null,
        avatar_url: null,
      };

      const mapped = mapGitHubProfile(profile);

      expect(mapped.name).toBe("developer");
      expect(mapped.username).toBe("developer");
      expect(mapped.email).toBeNull();
      expect(mapped.image).toBeNull();
    });

    it("assigns isAdmin = true when profile.id matches ADMIN_GITHUB_ID", () => {
      process.env.ADMIN_GITHUB_ID = "42424242";

      const profile = {
        id: 42424242,
        login: "admin-user",
        name: "Admin Person",
      };

      const mapped = mapGitHubProfile(profile);

      expect(mapped.isAdmin).toBe(true);
      expect(mapped.githubId).toBe(42424242);
      expect(mapped.username).toBe("admin-user");
    });

    it("assigns isAdmin = false when profile.id does not match ADMIN_GITHUB_ID", () => {
      process.env.ADMIN_GITHUB_ID = "42424242";

      const profile = {
        id: 11111111,
        login: "normal-user",
      };

      const mapped = mapGitHubProfile(profile);

      expect(mapped.isAdmin).toBe(false);
    });

    it("assigns isAdmin = false when ADMIN_GITHUB_ID is undefined or empty", () => {
      delete process.env.ADMIN_GITHUB_ID;

      const profile = {
        id: 42424242,
        login: "user-without-admin-env",
      };

      const mapped = mapGitHubProfile(profile);

      expect(mapped.isAdmin).toBe(false);
    });
  });

  describe("authConfig.callbacks.session", () => {
    it("enriches session.user with id, githubId, username, and isAdmin from database user", async () => {
      const sessionCallback = authConfig.callbacks?.session;
      expect(sessionCallback).toBeDefined();

      if (!sessionCallback) return;

      const baseSession = {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
        expires: "2026-12-31T23:59:59.000Z",
      };

      const dbUser = {
        id: "usr_uuid_12345",
        name: "Test User",
        email: "test@example.com",
        emailVerified: null,
        image: "https://example.com/avatar.png",
        githubId: 888888,
        username: "testuser",
        isAdmin: true,
      };

      type SessionCallbackFn = NonNullable<NonNullable<typeof authConfig.callbacks>["session"]>;
      const params = {
        session: baseSession as unknown as Session,
        user: dbUser as unknown as User,
        token: {},
        newSession: null,
        trigger: undefined,
      } as unknown as Parameters<SessionCallbackFn>[0];

      const result = await sessionCallback(params);

      expect(result.user.id).toBe("usr_uuid_12345");
      expect(result.user.githubId).toBe(888888);
      expect(result.user.username).toBe("testuser");
      expect(result.user.isAdmin).toBe(true);
    });

    it("handles snake_case fields (github_id, is_admin) gracefully in session callback", async () => {
      const sessionCallback = authConfig.callbacks?.session;
      if (!sessionCallback) return;

      const baseSession = {
        user: { name: "User" },
        expires: "2026-12-31T23:59:59.000Z",
      };

      const rawUser = {
        id: "usr_raw_123",
        username: "rawuser",
        github_id: 777777,
        is_admin: false,
      };

      type SessionCallbackFn = NonNullable<NonNullable<typeof authConfig.callbacks>["session"]>;
      const params = {
        session: baseSession as unknown as Session,
        user: rawUser as unknown as User,
        token: {},
        newSession: null,
        trigger: undefined,
      } as unknown as Parameters<SessionCallbackFn>[0];

      const result = await sessionCallback(params);

      expect(result.user.id).toBe("usr_raw_123");
      expect(result.user.githubId).toBe(777777);
      expect(result.user.username).toBe("rawuser");
      expect(result.user.isAdmin).toBe(false);
    });
  });
});

describe("TASK-17: UI Components - SignInButton & SignOutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SignInButton", () => {
    it("renders sign in button with default label and SVG GitHub icon", () => {
      render(React.createElement(SignInButton));

      const button = screen.getByRole("button", {
        name: /đăng nhập bằng github/i,
      });
      expect(button).toBeInTheDocument();

      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("shrink-0");
      expect(icon).toHaveClass("aspect-square");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("triggers signIn with github provider and default callbackUrl when clicked", async () => {
      render(React.createElement(SignInButton));

      const button = screen.getByRole("button", {
        name: /đăng nhập bằng github/i,
      });
      fireEvent.click(button);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledTimes(1);
        expect(signIn).toHaveBeenCalledWith("github", {
          callbackUrl: "/guestbook",
        });
      });
    });

    it("respects custom callbackUrl prop", async () => {
      render(React.createElement(SignInButton, { callbackUrl: "/custom-page" }));

      const button = screen.getByRole("button", {
        name: /đăng nhập bằng github/i,
      });
      fireEvent.click(button);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("github", {
          callbackUrl: "/custom-page",
        });
      });
    });
  });

  describe("SignOutButton", () => {
    it("renders sign out button with default label and LogOut icon", () => {
      render(React.createElement(SignOutButton));

      const button = screen.getByRole("button", {
        name: /đăng xuất/i,
      });
      expect(button).toBeInTheDocument();

      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("shrink-0");
      expect(icon).toHaveClass("aspect-square");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("triggers signOut with callbackUrl when clicked", async () => {
      render(React.createElement(SignOutButton));

      const button = screen.getByRole("button", {
        name: /đăng xuất/i,
      });
      fireEvent.click(button);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledTimes(1);
        expect(signOut).toHaveBeenCalledWith({
          callbackUrl: "/guestbook",
        });
      });
    });
  });
});
