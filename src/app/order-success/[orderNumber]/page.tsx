"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Phone, ShoppingBag, Truck, MapPin } from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = String(params.orderNumber || "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("last_kavel_order");
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const customerName = orderData?.fullName || "عميلنا العزيز";
  const totalAmount = orderData?.totalAmount || "";
  const address = orderData ? `${orderData.governorate} / ${orderData.cityName || ""} (${orderData.addressDetails})` : "";

  const whatsappMessage = encodeURIComponent(
    `مرحباً كافيل بيرفيوم 👋\nأنا ${customerName}، قمت بطلب العطور برقم: #${orderNumber}\nالمبلغ الإجمالي: ${totalAmount} د.أ\nالعنوان: ${address}\nأرجو تأكيد تجهيز الشحنة وشكراً لكم!`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-8">
      
      {/* Success Badge */}
      <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-lg animate-in zoom-in-75">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
          تم استلام طلبك بنجاح يا {customerName}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          رقم الطلب الخاص بك هو: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">#{orderNumber}</span>
        </p>
      </div>

      {/* Order Summary Box */}
      <div className="luxury-card p-6 bg-white border border-slate-200 text-right space-y-4 max-w-lg mx-auto shadow-sm">
        <h2 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
          تفاصيل التوصيل والاستلام:
        </h2>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>طريقة الدفع:</span>
            <span className="font-bold text-slate-900">الدفع نقداً عند الاستلام (COD)</span>
          </div>

          {totalAmount && (
            <div className="flex justify-between">
              <span>المبلغ الإجمالي المطلوب:</span>
              <span className="font-extrabold text-base text-[#3f2911]">{totalAmount} د.أ</span>
            </div>
          )}

          {address && (
            <div className="pt-2 border-t border-slate-100 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#ba997a] shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-emerald-700 font-semibold pt-1">
            <Truck className="w-4 h-4 shrink-0" />
            <span>مدة التوصيل المتوقعة: خلال 24 إلى 48 ساعة لباب منزلك.</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Direct Confirmation Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
        <a
          href={`https://wa.me/962782347865?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          <span>تأكيد ومتابعة عبر واتساب (0782347865)</span>
        </a>

        <Link
          href="/catalog"
          className="w-full py-3.5 px-6 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold shadow-xs transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 text-[#ba997a]" />
          <span>متابعة التسوق</span>
        </Link>
      </div>

    </div>
  );
}
