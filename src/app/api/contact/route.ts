import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactEnquiry } from "@/models/ContactEnquiry";
import { contactFormSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parseResult = contactFormSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, email, projectType, location, message, hp_website } = parseResult.data;

    // Anti-spam check: if honeypot was populated, quietly return success without storing bot spam
    if (hp_website && hp_website.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Enquiry received.",
        },
        { status: 200 }
      );
    }

    await connectToDatabase();

    const enquiry = await ContactEnquiry.create({
      name,
      phone,
      email: email || undefined,
      projectType,
      location: location || "Bhopal",
      message,
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting Rajshila Construction. We will get back to you shortly.",
        enquiryId: enquiry._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact enquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred while processing your enquiry. Please try reaching out via phone or WhatsApp directly.",
      },
      { status: 500 }
    );
  }
}
