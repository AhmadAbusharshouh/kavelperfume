import { NextRequest, NextResponse } from "next/server";
import { getDb, ordersTable, orderItemsTable } from "@/db";
import { createLogestechsPackage } from "@/lib/logestechs";
import { sendWhatsAppMessage } from "@/lib/evolutionApi";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (process.env as any) || {};
    const db = getDb(cfEnv.DB);

    if (!db) {
      return NextResponse.json({ success: false, error: "Database not available" }, { status: 500 });
    }

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);

    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }

    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
    const itemsDescription = items.map((i) => `${i.title} (${i.size}) × ${i.quantity}`).join(" + ");

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

    // Update Order in D1 with Tracking Number & Dispatched status
    await db
      .update(ordersTable)
      .set({
        status: "dispatched",
        logestechsTrackingNumber: logesResult.trackingNumber,
        logestechsAwbUrl: logesResult.awbUrl,
        logestechsPackageId: logesResult.packageId,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.id, orderId));

    // Send Shipping Alert via WhatsApp
    const trackingMsg = `مرحباً ${order.fullName}\nيسعدنا إبلاغك بأن طلبك #${order.orderNumber} من كافيل بيرفيوم قد خرج للتوصيل مع شركة لوجستكس!\n\nرقم التتبع: ${logesResult.trackingNumber}\nقيمة الطلب عند الاستلام: ${order.totalAmount} د.أ\n\nمندوب التوصيل سيتواصل معك خلال الساعات القادمة. شكراً لثقتك بنا`;

    try {
      await sendWhatsAppMessage(order.phone, trackingMsg);
    } catch (e) {
      console.error("WhatsApp shipping alert error:", e);
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
