import { NextResponse } from "next/server";
import { getGitHubTelemetry } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await getGitHubTelemetry();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve telemetry data" },
      { status: 500 },
    );
  }
}
