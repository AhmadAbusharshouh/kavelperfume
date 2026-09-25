import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPin,
  createAdminSessionToken,
  verifyAdminSessionToken,
  checkLoginRateLimit,
  recordFailedLogin,
  resetFailedLogin,
} from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const rateCheck = checkLoginRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `تم تجاوز الحد المسموح من المحاولات الخاطئة. الرجاء المحاولة بعد ${rateCheck.remainingSeconds} ثانية.`,
        },
        { status: 429 }
      );
    }

    const { pin } = await req.json();

    if (!pin || typeof pin !== "string" || !verifyAdminPin(pin)) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { success: false, error: "كلمة المرور السرية غير صحيحة" },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    resetFailedLogin(ip);

    // Generate cryptographically signed JWT token
    const token = await createAdminSessionToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set("kavel_admin_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("kavel_admin_auth");
  const isAuthenticated = await verifyAdminSessionToken(cookie?.value);
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
  response.cookies.set("kavel_admin_auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
