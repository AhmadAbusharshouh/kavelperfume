"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShieldCheck, Truck, Check, Phone, Sparkles, Gift, MapPin, User, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { formatJordanPhone } from "@/lib/phone";
import rawAreas from "@/data/logestechs-areas.json";
import { toast } from "sonner";

interface AreaItem {
  displayName: string;
  cityId: number;
  villageId: number;
  villageName: string;
  cityName: string;
}

interface GovernorateData {
  name: string;
  areas: AreaItem[];
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getShippingFee, getTotalAmount } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("عمان");
  const [selectedArea, setSelectedArea] = useState<AreaItem | null>(null);
  const [addressDetails, setAddressDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const governoratesList: GovernorateData[] = (rawAreas as { governorates: GovernorateData[] }).governorates || [];

  const currentGovAreas = useMemo(() => {
    const found = governoratesList.find((g) => g.name === governorate);
    return found ? found.areas : [];
  }, [governorate, governoratesList]);

  useEffect(() => {
    if (currentGovAreas.length > 0) {
      setSelectedArea(currentGovAreas[0]);
    } else {
      setSelectedArea(null);
    }
  }, [currentGovAreas]);

  const phoneValidation = useMemo(() => {
    return formatJordanPhone(phone);
  }, [phone]);

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotalAmount();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("سلة التسوق فارغة");
      return;
    }

    if (!fullName.trim()) {
      toast.error("يرجى إدخال الاسم الكامل");
      return;
    }

    if (!phoneValidation.isValid) {
      toast.error("يرجى إدخال رقم هاتف أردني صحيح (07XXXXXXXX)");
      return;
    }

    if (!addressDetails.trim()) {
      toast.error("يرجى كتابة تفاصيل العنوان (الشارع والحي ورقم البناء)");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phoneValidation.local,
        governorate,
        cityId: selectedArea?.cityId,
        cityName: selectedArea?.cityName || selectedArea?.displayName,
        villageId: selectedArea?.villageId,
        villageName: selectedArea?.villageName,
        addressDetails: addressDetails.trim(),
        notes: notes.trim(),
        items,
        subtotal,
        shippingFee: shipping,
        totalAmount: total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل إرسال الطلب");
      }

      sessionStorage.setItem("last_kavel_order", JSON.stringify({ ...payload, orderNumber: data.orderNumber }));

      clearCart();
      toast.success("تم تأكيد طلبك بنجاح!");
      router.push(`/order-success/${data.orderNumber}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse text-right">
        <div className="h-8 bg-slate-200 rounded-2xl w-64 mr-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 h-96 bg-white border border-slate-200 rounded-3xl" />
          <div className="lg:col-span-6 h-96 bg-white border border-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#fdfbf7] border border-[#ba997a]/30 flex items-center justify-center text-[#ba997a] shadow-xs">
          <Truck className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#3f2911]">سلة التسوق فارغة</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          لم تقم بإضافة أي عطور إلى سلتك حتى الآن. تصفح عروضنا الحصرية أو الكتالوج الكامل لاختيار عطرك المفضل.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            href="/#offers"
            className="px-6 py-3.5 bg-[#3f2911] text-white rounded-xl text-xs sm:text-sm font-black hover:bg-[#2a1a0a] transition active:scale-98 shadow-md border border-[#ba997a]/40"
          >
            عروض وبكجات التوفير
          </Link>
          <Link
            href="/catalog"
            className="px-6 py-3.5 bg-white border border-[#ba997a]/40 text-[#3f2911] rounded-xl text-xs sm:text-sm font-black hover:bg-[#fdfbf7] transition active:scale-98 shadow-2xs"
          >
            تصفح جميع العطور
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 text-right">
      
      {/* Page Heading */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba997a]/15 text-[#3f2911] text-xs font-black border border-[#ba997a]/30">
          <Truck className="w-3.5 h-3.5 text-[#ba997a]" />
          <span>الشراء الفوري السريع - الدفع عند الاستلام</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#3f2911]">
          سلة المشتريات وتأكيد الطلب
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          أدخل بيانات التوصيل أدناه لتأكيد طلبك مباشرة بدون الحاجة لكلمات مرور أو تسجيل دخول.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6 order-2 lg:order-1">
          
          <div className="luxury-card p-4 sm:p-6 bg-white border border-[#ba997a]/30 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs sm:text-sm font-black text-slate-900">
                العطور المختارة في طلبك ({items.length})
              </h2>
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-rose-600 font-black hover:underline cursor-pointer"
              >
                تفريغ السلة
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3 divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-start justify-between">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200 shrink-0 overflow-hidden p-1 flex items-center justify-center shadow-2xs">
                    <Image
                      src={item.image || "/images/perfumes/bleu-de-chanel.avif"}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">{item.title}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        aria-label="حذف العطر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500">
                      <span className="font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.size}
                      </span>
                      {item.surchargeTotal > 0 && (
                        <span className="text-amber-800 font-black bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                          +{item.surchargeTotal} د.أ فاخر
                        </span>
                      )}
                    </div>

                    {/* Bundle Sub-items */}
                    {item.selections && item.selections.length > 0 && (
                      <div className="p-2.5 bg-[#fdfbf7] rounded-xl border border-[#ba997a]/25 text-[11px] text-slate-600 space-y-1 mt-1">
                        <span className="font-black block text-[#3f2911]">العطور المختارة بالباقة:</span>
                        {item.selections.map((s, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span>• {s.name} ({s.size})</span>
                            {s.surcharge > 0 && <span className="font-bold text-amber-800">+{s.surcharge} د.أ</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quantity & Total */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center text-xs font-black hover:bg-slate-200 transition active:scale-90 cursor-pointer shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black px-2">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 flex items-center justify-center text-xs font-black hover:bg-slate-200 transition active:scale-90 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-base font-black text-[#3f2911]">
                        {item.totalPrice} د.أ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>المجموع الفرعي:</span>
                <span className="font-black text-slate-900">{subtotal} د.أ</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>رسوم التوصيل:</span>
                {shipping === 0 ? (
                  <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">مجاني (عرض الباقة)</span>
                ) : (
                  <span className="font-black text-slate-900">{shipping} د.أ</span>
                )}
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-[#3f2911] pt-3 border-t border-slate-200">
                <span>المجموع الكلي عند الاستلام:</span>
                <span className="text-base sm:text-xl font-black">{total} د.أ</span>
              </div>
            </div>

            {/* Guarantee Tag */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>ضمان الفحص والتجربة المباشرة قبل الدفع لمندوب التوصيل.</span>
            </div>
          </div>

        </div>

        {/* 4-Field Direct Checkout Form */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          
          <form
            onSubmit={handleSubmitOrder}
            className="luxury-card p-5 sm:p-8 bg-white border border-[#ba997a]/40 shadow-xl space-y-4 sm:space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#ba997a] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>شراء فوري بـ 4 خطوات بسيطة</span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-[#3f2911]">
                بيانات التوصيل السريع (الدفع عند الاستلام)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                بدون حساب أو كلمة مرور. 4 حقول بسيطة وسنبدأ تجهيز طلبك فوراً!
              </p>
            </div>

            {/* Field 1: Full Name */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                الاسم الكامل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد خالد العبداللات"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-[#fdfbf7]/60 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-[#ba997a] focus:ring-2 focus:ring-[#ba997a]/20"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Field 2: WhatsApp Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-slate-800">
                  رقم الواتساب لتأكيد الشحن والتتبع *
                </label>
                {phoneValidation.isValid && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="w-3 h-3" />
                    {phoneValidation.carrier}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="07XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pr-10 pl-4 py-3 bg-[#fdfbf7]/60 border rounded-xl text-sm font-black text-left outline-none transition ${
                    phoneValidation.isValid
                      ? "border-emerald-400 focus:border-emerald-500 bg-emerald-50/20"
                      : "border-slate-200 focus:border-[#ba997a] focus:ring-2 focus:ring-[#ba997a]/20"
                  }`}
                  dir="ltr"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Field 3: Governorate & Specific Area Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  المحافظة *
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#fdfbf7]/60 border border-slate-200 rounded-xl text-xs font-black outline-none focus:bg-white focus:border-[#ba997a] cursor-pointer"
                >
                  {governoratesList.map((g) => (
                    <option key={g.name} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  المنطقة / الحي *
                </label>
                <select
                  value={selectedArea ? selectedArea.displayName : ""}
                  onChange={(e) => {
                    const found = currentGovAreas.find((a) => a.displayName === e.target.value);
                    if (found) setSelectedArea(found);
                  }}
                  className="w-full px-3.5 py-3 bg-[#fdfbf7]/60 border border-slate-200 rounded-xl text-xs font-black outline-none focus:bg-white focus:border-[#ba997a] cursor-pointer"
                >
                  {currentGovAreas.map((a, idx) => (
                    <option key={idx} value={a.displayName}>
                      {a.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 4: Detailed Address */}
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                العنوان التفصيلي (الشارع، رقم البناء، معلم مميز) *
              </label>
              <div className="relative">
                <textarea
                  required
                  rows={2}
                  placeholder="مثال: شارع الجامعة، بجانب سوبرماركت الأمانة، عمارة 14 الطابق 2"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fdfbf7]/60 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#ba997a] focus:ring-2 focus:ring-[#ba997a]/20"
                />
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                ملاحظات إضافية لسائق التوصيل (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: التوصيل بعد الساعة 3 عصراً، الاتصال قبل الوصول..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fdfbf7]/60 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#ba997a]"
              />
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white text-sm sm:text-base font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[52px] border border-[#ba997a]/40 ${
                isSubmitting
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-[#3f2911] hover:bg-[#2a1a0a] hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <span>جاري تأكيد الطلب وإرسال التنبيه...</span>
              ) : (
                <>
                  <Truck className="w-5 h-5 text-[#ba997a]" />
                  <span>تأكيد الطلب والدفع عند الاستلام ({total} د.أ)</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500 font-medium">
              بمجرد الضغط على تأكيد الطلب، ستصلك رسالة فورية عبر الواتساب برقم الطلب وتفاصيل الشحن.
            </p>
          </form>

        </div>

      </div>

    </div>
  );
}
