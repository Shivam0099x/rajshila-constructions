import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession, verifyPassword, hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parseResult = changePasswordSchema.safeParse(body);

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

    const { currentPassword, newPassword } = parseResult.data;

    await connectToDatabase();
    const admin = await Admin.findById(session.sub);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin account not found" },
        { status: 404 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Current password does not match" },
        { status: 400 }
      );
    }

    admin.passwordHash = await hashPassword(newPassword);
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to change password" },
      { status: 500 }
    );
  }
}
