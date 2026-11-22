import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { BusinessSettings } from "@/models/BusinessSettings";
import { BUSINESS_INFO } from "@/constants/business";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await BusinessSettings.findOne().lean();

    if (!settings) {
      // Return default verified business info if DB doesn't have custom record yet
      settings = {
        businessName: BUSINESS_INFO.name,
        tagline: BUSINESS_INFO.tagline,
        shortDescription: BUSINESS_INFO.description,
        aboutText:
          "Founded and headquartered in Bhopal, Rajshila Construction provides a seamless integration of civil engineering, architectural structural work, and turnkey interior design.",
        address: BUSINESS_INFO.location.street,
        city: BUSINESS_INFO.location.city,
        state: BUSINESS_INFO.location.state,
        postalCode: BUSINESS_INFO.location.postalCode,
        country: BUSINESS_INFO.location.country,
        phone: BUSINESS_INFO.contact.phone,
        phoneDisplay: BUSINESS_INFO.contact.phoneDisplay,
        whatsapp: BUSINESS_INFO.contact.whatsappClean,
        email: BUSINESS_INFO.contact.email,
        openingHours: BUSINESS_INFO.hours.display,
        googleMapsUrl: BUSINESS_INFO.maps.listingUrl,
        heroHeadline: "Structural Integrity. Bespoke Architecture.",
        heroDescription: BUSINESS_INFO.description,
        heroCtaText: "Explore Projects",
        seoTitle: "Rajshila Construction | Architectural Construction & Interiors Bhopal",
        seoDescription: BUSINESS_INFO.description,
      } as unknown as typeof settings;
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Business settings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch business settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let settings = await BusinessSettings.findOne();

    if (!settings) {
      settings = await BusinessSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: "Business information updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Business settings PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update business settings" },
      { status: 500 }
    );
  }
}
