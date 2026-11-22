import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data-fetchers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "ongoing" | "completed" | null;
    const category = searchParams.get("category") || undefined;
    const featuredParam = searchParams.get("featured");
    const featured = featuredParam !== null ? featuredParam === "true" : undefined;

    const projects = await getProjects({
      status: status || undefined,
      category,
      featured,
    });

    return NextResponse.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("API error in /api/projects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve projects",
      },
      { status: 500 }
    );
  }
}
