import { NextResponse } from "next/server";
import { getGooglePlacesData } from "@/lib/google-places";

export async function GET() {
  try {
    const placesData = await getGooglePlacesData();
    return NextResponse.json({
      success: true,
      data: placesData,
    });
  } catch (error) {
    console.error("API error in /api/reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to load reviews",
      },
      { status: 500 }
    );
  }
}
