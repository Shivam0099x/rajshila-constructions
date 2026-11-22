import { NextResponse } from "next/server";
import { getBusinessSettings } from "@/lib/data-fetchers";

export async function GET() {
  try {
    const businessSettings = await getBusinessSettings();
    return NextResponse.json({
      success: true,
      data: businessSettings,
    });
  } catch (error) {
    console.error("Public business API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch business information" },
      { status: 500 }
    );
  }
}
