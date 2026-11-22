import { NextResponse } from "next/server";
import { getServices } from "@/lib/data-fetchers";

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Public services API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
