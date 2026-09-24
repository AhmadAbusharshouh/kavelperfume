import { formatJordanPhone } from "./phone";

const EVOLUTION_BASE_URL = process.env.EVOLUTION_API_BASE_URL || "https://wa.alphaperfume.net";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "AlphaSecretKey2026!357951****++";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || "kavel";
const ADMIN_PHONE = process.env.ADMIN_ALERT_PHONE || "+962782347865";

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWhatsAppMessage(
  recipientPhone: string,
  messageText: string
): Promise<WhatsAppSendResult> {
  try {
    const formatted = formatJordanPhone(recipientPhone);
    const cleanNumber = formatted.international.replace("+", "");

    const endpoint = `${EVOLUTION_BASE_URL}/message/sendText/${EVOLUTION_INSTANCE}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: messageText,
        options: {
          delay: 1200,
          presence: "composing",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: `Evolution API (${res.status}): ${err}` };
    }

    const data = (await res.json()) as { key?: { id?: string } };
    return {
      success: true,
      messageId: data.key?.id,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: `WhatsApp Network Error: ${msg}` };
  }
}

export async function sendCustomerOrderConfirmationWhatsApp(order: {
  orderNumber: string;
  fullName: string;
  phone: string;
  governorate: string;
  cityName?: string;
  addressDetails: string;
  totalAmount: number;
  items: Array<{ title: string; size: string; quantity: number; totalPrice: number }>;
}): Promise<WhatsAppSendResult> {
  const itemsText = order.items
    .map((i) => `• ${i.title} (${i.size}) × ${i.quantity} = ${i.totalPrice} د.أ`)
    .join("\n");

  const message = `أهلاً بك يا ${order.fullName} في كافيل بيرفيوم (Kavel Perfume)

تم استلام طلبك بنجاح وسنقوم بتجهيزه فوراً!

📦 رقم الطلب: #${order.orderNumber}
💵 المبلغ الإجمالي عند الاستلام: ${order.totalAmount} د.أ
📍 عنوان التوصيل: ${order.governorate} / ${order.cityName || ""} (${order.addressDetails})

العطور المطلوبة:
${itemsText}

🚚 سيتم التواصل معك عبر مندوب شركة التوصيل فور خروج الشحنة.
شكراً لاختيارك كافيل بيرفيوم`;

  return sendWhatsAppMessage(order.phone, message);
}

export async function sendAdminOrderAlertWhatsApp(order: {
  orderNumber: string;
  fullName: string;
  phone: string;
  governorate: string;
  cityName?: string;
  addressDetails: string;
  totalAmount: number;
  items: Array<{ title: string; size: string; quantity: number; totalPrice: number }>;
}): Promise<WhatsAppSendResult> {
  const itemsText = order.items
    .map((i) => `• ${i.title} (${i.size}) × ${i.quantity}`)
    .join("\n");

  const message = `🚨 طلب جديد في متجر كافيل بيرفيوم!

رقم الطلب: #${order.orderNumber}
العميل: ${order.fullName}
الهاتف: ${order.phone}
المدينة: ${order.governorate} / ${order.cityName || ""}
العنوان: ${order.addressDetails}
المبلغ الإجمالي: ${order.totalAmount} د.أ

المنتجات:
${itemsText}

لوحة التحكم: https://kavelperfume.com/admin`;

  return sendWhatsAppMessage(ADMIN_PHONE, message);
}
