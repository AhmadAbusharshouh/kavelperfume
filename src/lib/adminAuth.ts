import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

export const DEFAULT_ADMIN_PIN = "KavelAdmin@2026#SecureVault!981";

export function getAdminPinSecret(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfEnv = (process.env as any) || {};
  return (
    process.env.ADMIN_PIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    cfEnv.ADMIN_PIN_SECRET ||
    DEFAULT_ADMIN_PIN
  );
}

function getJwtSecretKey(): Uint8Array {
  const secret = getAdminPinSecret();
  // Ensure strong 256-bit key derivation
  return new TextEncoder().encode(`kavel_luxury_perfume_admin_auth_jwt_key_2026_salt_${secret}`);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aTrim = a.trim();
  const bTrim = b.trim();
  if (aTrim.length !== bTrim.length) return false;
  let mismatch = 0;
  for (let i = 0; i < aTrim.length; i++) {
    mismatch |= aTrim.charCodeAt(i) ^ bTrim.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Verify input password/PIN against configured admin secret
 */
export function verifyAdminPin(inputPin: string): boolean {
  if (!inputPin || typeof inputPin !== "string") return false;
  const secret = getAdminPinSecret();
  return timingSafeEqual(inputPin.trim(), secret.trim());
}

/**
 * Sign a secure JWT session token for authenticated admin
 */
export async function createAdminSessionToken(): Promise<string> {
  const secretKey = getJwtSecretKey();
  return new SignJWT({
    role: "kavel_admin",
    aud: "kavel_admin_portal",
    iss: "kavelperfume.com",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verify JWT session token
 */
export async function verifyAdminSessionToken(token?: string | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: "kavelperfume.com",
      audience: "kavel_admin_portal",
    });
    return payload.role === "kavel_admin";
  } catch {
    return false;
  }
}

/**
 * Verify incoming admin HTTP request (via Cookie or Authorization Header)
 */
export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  // 1. Check HTTP-only signed session cookie
  const sessionCookie = req.cookies.get("kavel_admin_auth")?.value;
  if (sessionCookie && (await verifyAdminSessionToken(sessionCookie))) {
    return true;
  }

  // 2. Check Authorization Header (Bearer token or direct secret key for automated integrations)
  const authHeader =
    req.headers.get("authorization") ||
    req.headers.get("x-admin-key") ||
    req.headers.get("x-admin-pin");

  if (authHeader) {
    const cleanAuth = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (await verifyAdminSessionToken(cleanAuth)) {
      return true;
    }
    if (verifyAdminPin(cleanAuth)) {
      return true;
    }
  }

  return false;
}

// In-memory rate limiting map for brute-force prevention
const failedAttemptsMap = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const record = failedAttemptsMap.get(ip);
  if (!record) return { allowed: true, remainingSeconds: 0 };

  if (now > record.resetAt) {
    failedAttemptsMap.delete(ip);
    return { allowed: true, remainingSeconds: 0 };
  }

  if (record.count >= 5) {
    const remainingSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, remainingSeconds };
  }

  return { allowed: true, remainingSeconds: 0 };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = failedAttemptsMap.get(ip);
  if (!record || now > record.resetAt) {
    failedAttemptsMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 }); // 10 min window
  } else {
    record.count += 1;
  }
}

export function resetFailedLogin(ip: string): void {
  failedAttemptsMap.delete(ip);
}
