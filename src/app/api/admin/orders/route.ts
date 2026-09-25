import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { getAllOrders, updateOrderStatus } from "@/lib/orderStore";

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." }, { status: 401 });
    }

    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[KAVEL ADMIN ORDERS ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const isAuthed = await verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
    }

    await updateOrderStatus(orderId, { status });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
