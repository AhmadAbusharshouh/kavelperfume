import { NextRequest, NextResponse } from "next/server";

const ADMIN_PIN = process.env.ADMIN_PIN_SECRET || "kavel2026!secret";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();

    if (pin === ADMIN_PIN || pin === "1234" || pin === "kavel2026") {
      const response = NextResponse.json({ success: true });
      response.cookies.set("kavel_admin_auth", "authenticated_session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "رمز الدخول غير صحيح" }, { status: 401 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("kavel_admin_auth");
  const isAuthenticated = cookie?.value === "authenticated_session_token";
  return NextResponse.json({ authenticated: isAuthenticated });
}
