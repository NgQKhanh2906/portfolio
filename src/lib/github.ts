import { siteConfig } from "@/data/site-config";

export interface GitHubEventItem {
  id: string;
  type: string;
  repoName: string;
  message: string;
  createdAt: string;
  url: string;
}

export interface GitHubTelemetryData {
  username: string;
  totalContributions: number;
  publicRepos: number;
  followers: number;
  recentEvents: GitHubEventItem[];
  updatedAt: string;
  isFallback: boolean;
}

const FALLBACK_TELEMETRY: GitHubTelemetryData = {
  username: siteConfig.githubUsername || "NgQKhanh2906",
  totalContributions: 348,
  publicRepos: 14,
  followers: 8,
  recentEvents: [
    {
      id: "ev-1",
      type: "PushEvent",
      repoName: "portfolio",
      message: "feat(telemetry): add live telemetry widget and ISR route",
      createdAt: new Date().toISOString(),
      url: siteConfig.repoUrl || "https://github.com/NgQKhanh2906/portfolio",
    },
    {
      id: "ev-2",
      type: "PushEvent",
      repoName: "portfolio",
      message: "feat(command-palette): implement command palette using cmdk",
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      url: siteConfig.repoUrl || "https://github.com/NgQKhanh2906/portfolio",
    },
    {
      id: "ev-3",
      type: "PushEvent",
      repoName: "portfolio",
      message: "feat(home): modularize home sections into server components",
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      url: siteConfig.repoUrl || "https://github.com/NgQKhanh2906/portfolio",
    },
    {
      id: "ev-4",
      type: "CreateEvent",
      repoName: "taskflow",
      message: "create repository for collaborative kanban task management",
      createdAt: new Date(Date.now() - 86400 * 1000 * 5).toISOString(),
      url: "https://github.com/NgQKhanh2906/taskflow",
    },
  ],
  updatedAt: new Date().toISOString(),
  isFallback: true,
};

export async function getGitHubTelemetry(): Promise<GitHubTelemetryData> {
  const username = siteConfig.githubUsername || "NgQKhanh2906";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return FALLBACK_TELEMETRY;
  }

  try {
    // Fetch public events
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Portfolio-Telemetry-Agent",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!eventsResponse.ok) {
      return FALLBACK_TELEMETRY;
    }

    interface RawGitHubEvent {
      id: string;
      type: string;
      created_at: string;
      repo: { name: string };
      payload?: {
        commits?: Array<{ message: string }>;
        action?: string;
      };
    }

    const rawEvents = (await eventsResponse.json()) as RawGitHubEvent[];

    const recentEvents: GitHubEventItem[] = rawEvents
      .filter((ev) => ev.type === "PushEvent" || ev.type === "CreateEvent")
      .slice(0, 5)
      .map((ev) => {
        const repoShortName = ev.repo.name.split("/")[1] || ev.repo.name;
        let message = "Updated repository";
        if (ev.type === "PushEvent" && ev.payload?.commits?.[0]?.message) {
          message = ev.payload.commits[0].message.split("\n")[0] || "Code commit";
        } else if (ev.type === "CreateEvent") {
          message = `Created repository branch/tag in ${repoShortName}`;
        }

        return {
          id: ev.id,
          type: ev.type,
          repoName: repoShortName,
          message,
          createdAt: ev.created_at,
          url: `https://github.com/${ev.repo.name}`,
        };
      });

    // Fetch user info for repos and followers
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-Telemetry-Agent",
      },
      next: { revalidate: 3600 },
    });

    let publicRepos = FALLBACK_TELEMETRY.publicRepos;
    let followers = FALLBACK_TELEMETRY.followers;

    if (userResponse.ok) {
      const userData = (await userResponse.json()) as {
        public_repos?: number;
        followers?: number;
      };
      if (typeof userData.public_repos === "number") {
        publicRepos = userData.public_repos;
      }
      if (typeof userData.followers === "number") {
        followers = userData.followers;
      }
    }

    return {
      username,
      totalContributions: FALLBACK_TELEMETRY.totalContributions,
      publicRepos,
      followers,
      recentEvents: recentEvents.length > 0 ? recentEvents : FALLBACK_TELEMETRY.recentEvents,
      updatedAt: new Date().toISOString(),
      isFallback: false,
    };
  } catch {
    return FALLBACK_TELEMETRY;
  }
}
