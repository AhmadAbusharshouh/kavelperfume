import { NextRequest, NextResponse } from "next/server";
import { createAndSaveOrder } from "@/lib/orderStore";
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

    if (!fullName || !phone || !governorate || !addressDetails || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "جميع الحقول الأساسية مطلوبة (الاسم، الهاتف، المحافظة، العنوان، والمنتجات)" },
        { status: 400 }
      );
    }

    // Generate clean Jordanian Order Number (e.g. KV-84920)
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `KV-${randomDigits}`;
    const orderId = `ord_${nanoid(12)}`;

    // Prepare item entities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderItems = items.map((item: any) => ({
      id: `item_${nanoid(12)}`,
      orderId,
      itemType: item.type || "single",
      title: String(item.title || "عطر كافيل"),
      size: String(item.size || "110ml"),
      quantity: Number(item.quantity) || 1,
      basePrice: Number(item.basePrice) || 0,
      surchargeTotal: Number(item.surchargeTotal) || 0,
      totalPrice: Number(item.totalPrice) || 0,
      selections: item.selections ? JSON.stringify(item.selections) : null,
      giftNotes: item.giftNotes || null,
    }));

    // Save order in both D1 and resilient backup storage
    await createAndSaveOrder(
      {
        id: orderId,
        orderNumber,
        fullName: fullName.trim(),
        phone: phone.trim(),
        governorate: governorate.trim(),
        cityId: cityId ? Number(cityId) : null,
        cityName: cityName ? String(cityName).trim() : null,
        villageId: villageId ? Number(villageId) : null,
        villageName: villageName ? String(villageName).trim() : null,
        addressDetails: addressDetails.trim(),
        notes: notes ? String(notes).trim() : null,
        subtotal: parseFloat(subtotal) || 0,
        shippingFee: parseFloat(shippingFee) || 0,
        totalAmount: parseFloat(totalAmount) || 0,
        status: "pending",
        whatsappNotified: false,
      },
      orderItems
    );

    // Send WhatsApp Notifications in background
    const orderPayload = {
      orderNumber,
      fullName: fullName.trim(),
      phone: phone.trim(),
      governorate: governorate.trim(),
      cityName: cityName ? String(cityName).trim() : undefined,
      addressDetails: addressDetails.trim(),
      totalAmount: parseFloat(totalAmount) || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: items.map((i: any) => ({
        title: String(i.title || ""),
        size: String(i.size || "110ml"),
        quantity: Number(i.quantity) || 1,
        totalPrice: Number(i.totalPrice) || 0,
      })),
    };

    // Non-blocking notification dispatch
    try {
      await Promise.allSettled([
        sendCustomerOrderConfirmationWhatsApp(orderPayload),
        sendAdminOrderAlertWhatsApp(orderPayload),
      ]);
    } catch (waErr) {
      console.error("[KAVEL WHATSAPP] Notification dispatch warning:", waErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      totalAmount: parseFloat(totalAmount) || 0,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[KAVEL ORDER ERROR] Order creation failed:", msg);
    return NextResponse.json(
      { success: false, error: `حدث خطأ أثناء حفظ الطلب: ${msg}` },
      { status: 500 }
    );
  }
}
