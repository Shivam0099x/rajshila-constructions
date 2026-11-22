import { jwtVerify, SignJWT } from "jose";
import { AdminSessionPayload } from "@/types";

export const AUTH_COOKIE_NAME = "admin_session";
const JWT_SECRET_STRING =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  "rajshila_construction_super_secret_jwt_key_2026_bhopal";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const SESSION_EXPIRATION_DAYS = 7;

/**
 * Create a signed JWT session token (Web Crypto API - Edge compatible)
 */
export async function createAdminToken(payload: {
  id: string;
  username: string;
  email: string;
  role: string;
}): Promise<string> {
  return new SignJWT({
    sub: payload.id,
    username: payload.username,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRATION_DAYS}d`)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode an admin JWT token (Web Crypto API - Edge compatible)
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      sub: payload.sub as string,
      username: payload.username as string,
      email: payload.email as string,
      role: (payload.role as string) || "admin",
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
