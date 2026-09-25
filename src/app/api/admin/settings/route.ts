import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { getStoreSettings, saveStoreSetting } from "@/lib/orderStore";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(settings);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول" }, { status: 401 });
    }

    const { key, value } = await req.json();

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: "المفتاح والقيمة مطلوبة" }, { status: 400 });
    }

    await saveStoreSetting(key, value);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
