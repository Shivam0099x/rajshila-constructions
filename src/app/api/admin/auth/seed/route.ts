import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { getAdminSession } from "@/lib/auth";
import { seedAdminUser } from "@/scripts/seed-admin";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const existingCount = await Admin.countDocuments();

    // If an admin already exists, only an authenticated admin can invoke seed
    if (existingCount > 0) {
      const session = await getAdminSession(req);
      if (!session) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden. Admin account already exists. Please login to manage accounts.",
          },
          { status: 403 }
        );
      }
    }

    const result = await seedAdminUser();
    return NextResponse.json({
      success: true,
      message: "Admin account initialized successfully",
      details: result,
    });
  } catch (error) {
    console.error("Admin seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to seed admin account",
      },
      { status: 400 }
    );
  }
}
