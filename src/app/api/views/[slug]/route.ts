import { NextRequest, NextResponse } from "next/server";
import { incrementProjectViews, getProjectViews } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const slug = params.slug;
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor ? forwardedFor.split(",")[0]?.trim() || "127.0.0.1" : realIp || "127.0.0.1";

    const views = await incrementProjectViews(slug, ip);

    return NextResponse.json({ views }, { status: 200 });
  } catch {
    return NextResponse.json({ views: null }, { status: 200 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const slug = params.slug;
    const views = await getProjectViews(slug);

    return NextResponse.json({ views }, { status: 200 });
  } catch {
    return NextResponse.json({ views: null }, { status: 200 });
  }
}
