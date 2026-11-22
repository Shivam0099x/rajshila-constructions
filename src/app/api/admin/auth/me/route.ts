import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession(req);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const admin = await Admin.findById(session.sub).select("-passwordHash");

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, error: "Account inactive or not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user session" },
      { status: 500 }
    );
  }
}
