import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactEnquiry } from "@/models/ContactEnquiry";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;

    const [enquiries, total] = await Promise.all([
      ContactEnquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactEnquiry.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: enquiries,
    });
  } catch (error) {
    console.error("Enquiries GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}
