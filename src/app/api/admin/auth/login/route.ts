import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Admin } from "@/models/Admin";
import {
  verifyPassword,
  createAdminToken,
  setAdminSessionCookie,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  hashPassword,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Check rate limit
    const rateCheck = checkLoginRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please try again in ${rateCheck.retryAfterSec || 900} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid login credentials format",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    await connectToDatabase();

    let admin = await Admin.findOne({ email });

    // Auto-bootstrap admin account from environment if database has no admin yet
    if (!admin && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (email === process.env.ADMIN_EMAIL.toLowerCase().trim() && password === process.env.ADMIN_PASSWORD) {
        const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD);
        admin = await Admin.create({
          username: process.env.ADMIN_USERNAME || "rajshila_admin",
          email,
          passwordHash,
          role: "superadmin",
          isActive: true,
        });
      }
    }

    if (!admin || !admin.isActive) {
      recordFailedLogin(ip);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, admin.passwordHash);

    if (!isMatch) {
      recordFailedLogin(ip);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Reset rate limiting on successful login
    resetLoginAttempts(ip);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create session token
    const token = await createAdminToken({
      id: String(admin._id),
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });

    // Set secure HTTP-only cookie
    setAdminSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred during authentication",
      },
      { status: 500 }
    );
  }
}
