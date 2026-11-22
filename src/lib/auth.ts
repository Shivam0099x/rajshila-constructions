import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { AdminSessionPayload } from "@/types";
import {
  AUTH_COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
} from "./auth-token";

export { AUTH_COOKIE_NAME, createAdminToken, verifyAdminToken };

const SESSION_EXPIRATION_DAYS = 7;

/**
 * Hash password with bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Read and verify session from request cookies
 */
export async function getAdminSession(
  req: NextRequest | Request
): Promise<AdminSessionPayload | null> {
  let token: string | undefined;

  if ("cookies" in req && typeof req.cookies.get === "function") {
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  } else {
    // For standard Request
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
      if (match) {
        token = match.split("=")[1];
      }
    }
  }

  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Attach HTTP-only session cookie to response
 */
export function setAdminSessionCookie(res: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_EXPIRATION_DAYS,
  });
}

/**
 * Clear session cookie on logout
 */
export function clearAdminSessionCookie(res: NextResponse): void {
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * In-memory rate limiting for login attempts
 * Limits to 5 failed attempts per IP within a 15-minute window.
 */
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  const blockDurationMs = 15 * 60 * 1000;

  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remaining: maxAttempts };
  }

  if (record.blockedUntil && now < record.blockedUntil) {
    const retryAfterSec = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  // Reset if window has elapsed
  if (now - record.firstAttempt > windowMs) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: maxAttempts };
  }

  if (record.attempts >= maxAttempts) {
    record.blockedUntil = now + blockDurationMs;
    loginAttempts.set(ip, record);
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil(blockDurationMs / 1000) };
  }

  return { allowed: true, remaining: maxAttempts - record.attempts };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { attempts: 1, firstAttempt: now });
  } else {
    record.attempts += 1;
    loginAttempts.set(ip, record);
  }
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}
