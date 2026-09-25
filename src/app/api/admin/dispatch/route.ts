import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { getOrderById, updateOrderStatus } from "@/lib/orderStore";
import { createLogestechsPackage } from "@/lib/logestechs";
import { sendWhatsAppMessage } from "@/lib/evolutionApi";

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await verifyAdminRequest(req);
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }

    const items = order.items || [];
    const itemsDescription =
      items.length > 0
        ? items.map((i) => `${i.title} (${i.size}) × ${i.quantity}`).join(" + ")
        : "عطور كافيل بيرفيوم";

    // Dispatch to LogesTechs from Abu Nseir warehouse (1151 / 6250)
    const logesResult = await createLogestechsPackage({
      orderNumber: order.orderNumber,
      recipientName: order.fullName,
      recipientPhone: order.phone,
      destinationCityId: order.cityId || 1151,
      destinationVillageId: order.villageId || undefined,
      destinationAddress: `${order.governorate} / ${order.cityName || ""} / ${order.addressDetails}`,
      totalPriceJod: order.totalAmount,
      itemsDescription,
      notes: order.notes || undefined,
    });

    if (!logesResult.success) {
      return NextResponse.json(
        { success: false, error: logesResult.error || "فشل الربط مع لوجستكس" },
        { status: 502 }
      );
    }

    // Update Order with Tracking Number & Dispatched status across D1 and backup storage
    await updateOrderStatus(order.id, {
      status: "dispatched",
      logestechsTrackingNumber: logesResult.trackingNumber,
      logestechsAwbUrl: logesResult.awbUrl,
      logestechsPackageId: logesResult.packageId,
    });

    // Send Shipping Alert via WhatsApp
    const trackingMsg = `مرحباً ${order.fullName}\nيسعدنا إبلاغك بأن طلبك #${order.orderNumber} من كافيل بيرفيوم قد خرج للتوصيل مع شركة لوجستكس!\n\nرقم التتبع: ${logesResult.trackingNumber}\nقيمة الطلب عند الاستلام: ${order.totalAmount} د.أ\n\nمندوب التوصيل سيتواصل معك خلال الساعات القادمة. شكراً لثقتك بنا`;

    try {
      await sendWhatsAppMessage(order.phone, trackingMsg);
    } catch (e) {
      console.error("[KAVEL DISPATCH] WhatsApp shipping alert error:", e);
    }

    return NextResponse.json({
      success: true,
      trackingNumber: logesResult.trackingNumber,
      awbUrl: logesResult.awbUrl,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
