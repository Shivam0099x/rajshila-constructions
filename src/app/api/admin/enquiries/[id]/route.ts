import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactEnquiry } from "@/models/ContactEnquiry";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const enquiry = await ContactEnquiry.findById(id).lean();

    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Enquiry GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const allowedStatuses = ["new", "reviewed", "contacted", "resolved", "archived"];
    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updated = await ContactEnquiry.findByIdAndUpdate(
      id,
      {
        ...(body.status ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated",
      data: updated,
    });
  } catch (error) {
    console.error("Enquiry PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const enquiry = await ContactEnquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("Enquiry DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
