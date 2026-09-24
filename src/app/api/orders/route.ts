import { NextRequest, NextResponse } from "next/server";
import { getDb, ordersTable, orderItemsTable } from "@/db";
import { sendCustomerOrderConfirmationWhatsApp, sendAdminOrderAlertWhatsApp } from "@/lib/evolutionApi";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      governorate,
      cityId,
      cityName,
      villageId,
      villageName,
      addressDetails,
      notes,
      items,
      subtotal,
      shippingFee,
      totalAmount,
    } = body;

    if (!fullName || !phone || !governorate || !addressDetails || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "جميع الحقول الأساسية مطلوبة (الاسم، الهاتف، المحافظة، العنوان، والمنتجات)" },
        { status: 400 }
      );
    }

    // Generate clean Jordanian Order Number (e.g. KV-84920)
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `KV-${randomDigits}`;
    const orderId = `ord_${nanoid(12)}`;
    const now = new Date();

    // D1 Database Context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (process.env as any) || {};
    const d1Database = cfEnv.DB;
    const db = getDb(d1Database);

    if (db) {
      // Save Order in D1
      await db.insert(ordersTable).values({
        id: orderId,
        orderNumber,
        fullName,
        phone,
        governorate,
        cityId: cityId || null,
        cityName: cityName || null,
        villageId: villageId || null,
        villageName: villageName || null,
        addressDetails,
        notes: notes || null,
        subtotal: parseFloat(subtotal),
        shippingFee: parseFloat(shippingFee),
        totalAmount: parseFloat(totalAmount),
        status: "pending",
        whatsappNotified: false,
        createdAt: now,
        updatedAt: now,
      });

      // Save Order Items in D1
      for (const item of items) {
        await db.insert(orderItemsTable).values({
          id: `item_${nanoid(12)}`,
          orderId,
          itemType: item.type || "single",
          title: item.title,
          size: item.size || "110ml",
          quantity: item.quantity || 1,
          basePrice: item.basePrice || 0,
          surchargeTotal: item.surchargeTotal || 0,
          totalPrice: item.totalPrice || 0,
          selections: item.selections ? JSON.stringify(item.selections) : null,
          giftNotes: item.giftNotes || null,
          createdAt: now,
        });
      }
    }

    // Send WhatsApp Notifications in background
    const orderPayload = {
      orderNumber,
      fullName,
      phone,
      governorate,
      cityName,
      addressDetails,
      totalAmount,
      items: items.map((i: { title: string; size: string; quantity: number; totalPrice: number }) => ({
        title: i.title,
        size: i.size,
        quantity: i.quantity,
        totalPrice: i.totalPrice,
      })),
    };

    // Non-blocking notification dispatch
    try {
      await Promise.allSettled([
        sendCustomerOrderConfirmationWhatsApp(orderPayload),
        sendAdminOrderAlertWhatsApp(orderPayload),
      ]);
    } catch (waErr) {
      console.error("WhatsApp dispatch error:", waErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      totalAmount,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Order creation failed:", msg);
    return NextResponse.json(
      { success: false, error: `حدث خطأ أثناء حفظ الطلب: ${msg}` },
      { status: 500 }
    );
  }
}
