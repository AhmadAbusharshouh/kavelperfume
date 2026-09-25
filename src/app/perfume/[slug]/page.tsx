"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Truck, Check, Clock, Wind, Award, Zap, Sparkles, Gift, ShieldCheck } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

export default function PerfumeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");
  const product = getProductBySlug(slug);

  const [selectedSize, setSelectedSize] = useState<"110ml" | "55ml">("110ml");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const addSinglePerfume = useCartStore((state) => state.addSinglePerfume);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-[#3f2911]">العطر غير موجود</h1>
        <p className="text-xs text-slate-500">قد يكون الرابط خاطئاً أو تم نقل المنتج.</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3f2911] text-white rounded-xl text-xs font-black shadow-md"
        >
          العودة للكتالوج
        </Link>
      </div>
    );
  }

  const is110 = selectedSize === "110ml";
  const currentPrice = is110 ? product.effectivePrice110 : product.effectivePrice55;
  const surcharge = is110 ? product.surcharge110 : product.surcharge55;

  const galleryImages = [
    product.image,
    is110
      ? "/images/kavel/01_kavel-110ml-perfume-box-front.avif"
      : "/images/kavel/05_kavel-55ml-perfume-box-front.avif",
    "/images/kavel/08_kavel-luxury-shopping-gift-bag.avif",
    is110
      ? "/images/kavel/03_kavel-110ml-circular-coaster-label.avif"
      : "/images/kavel/07_kavel-55ml-circular-coaster-label.avif",
  ];

  const handleAddToCart = () => {
    addSinglePerfume(product, selectedSize);
    toast.success(`تمت إضافة ${product.name} (${selectedSize}) إلى السلة`);
    setDrawerOpen(true);
  };

  const handleBuyNow = () => {
    addSinglePerfume(product, selectedSize);
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 pb-28 sm:pb-16 text-right">
      
      {/* Back Button */}
      <div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#ba997a] transition-colors group"
        >
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>العودة لجميع العطور</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-white border border-[#ba997a]/30 shadow-xl p-6 sm:p-8 overflow-hidden flex items-center justify-center">
            <Image
              src={galleryImages[activeImageIdx]}
              alt={product.name}
              fill
              priority
              className="object-contain p-4 sm:p-6 transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 550px"
            />
            {surcharge > 0 && (
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black rounded-xl shadow-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>صنف فاخر (+{surcharge} د.أ)</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-square rounded-2xl bg-white border p-1.5 transition-all overflow-hidden cursor-pointer active:scale-95 ${
                  activeImageIdx === idx
                    ? "border-[#ba997a] ring-2 ring-[#ba997a]/30 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="صورة المعرض" fill className="object-contain p-1" sizes="100px" />
              </button>
            ))}
          </div>
        </div>

        {/* Info & Buy Controls */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          
          {/* Categories Pill List */}
          <div className="flex flex-wrap gap-1.5">
            {product.categories.map((c) => (
              <span key={c} className="text-[11px] font-black px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
                {c}
              </span>
            ))}
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#3f2911] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-400 mt-1" dir="ltr">
              {product.nameEn}
            </p>
          </div>

          {/* Pricing Row */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#fdfbf7] border border-[#ba997a]/35 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-xs text-slate-500 font-bold block">السعر الحالي ({selectedSize})</span>
              <span className="text-2xl sm:text-4xl font-black text-[#3f2911]">
                {currentPrice} <span className="text-xs sm:text-sm font-bold text-slate-600">د.أ</span>
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs text-slate-400 line-through block font-bold">
                {is110 ? "32 د.أ" : "22 د.أ"}
              </span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                وفر 50% مع كافيل
              </span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-800">اختر حجم الزجاجة:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedSize("110ml")}
                className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer active:scale-98 min-h-[64px] ${
                  is110
                    ? "bg-white border-[#ba997a] ring-2 ring-[#ba997a]/30 shadow-xs"
                    : "bg-[#fdfbf7]/40 border-slate-200 hover:bg-white text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs sm:text-sm font-black text-slate-900">110 مل (الأكثر طلباً)</strong>
                  {is110 && <Check className="w-4 h-4 text-[#ba997a]" />}
                </div>
                <span className="text-xs font-black text-[#3f2911] mt-1">
                  {product.effectivePrice110} د.أ <span className="text-[10px] text-slate-400 font-normal">/ 1,100+ رشة</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSize("55ml")}
                className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer active:scale-98 min-h-[64px] ${
                  !is110
                    ? "bg-white border-[#ba997a] ring-2 ring-[#ba997a]/30 shadow-xs"
                    : "bg-[#fdfbf7]/40 border-slate-200 hover:bg-white text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs sm:text-sm font-black text-slate-900">55 مل (حجم عملي)</strong>
                  {!is110 && <Check className="w-4 h-4 text-[#ba997a]" />}
                </div>
                <span className="text-xs font-black text-[#3f2911] mt-1">
                  {product.effectivePrice55} د.أ <span className="text-[10px] text-slate-400 font-normal">/ 550+ رشة</span>
                </span>
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="py-4 px-6 rounded-xl bg-[#3f2911] hover:bg-[#2a1a0a] text-white text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[50px] border border-[#ba997a]/40"
            >
              <Truck className="w-4 h-4 text-[#ba997a]" />
              <span>اطلب الآن (الدفع عند الاستلام)</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="py-4 px-6 rounded-xl bg-white border border-[#ba997a] hover:bg-[#fdfbf7] text-[#3f2911] text-xs sm:text-sm font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[50px]"
            >
              <ShoppingBag className="w-4 h-4 text-[#ba997a]" />
              <span>إضافة للسلة</span>
            </button>
          </div>

          {/* Fragrance Performance Radar */}
          <div className="luxury-card p-4 sm:p-5 bg-white border border-slate-200/90 space-y-3 shadow-xs">
            <h3 className="text-xs font-black text-slate-900">مواصفات وأداء تركيبة كافيل:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="p-3 bg-[#fdfbf7] rounded-xl border border-slate-100">
                <Clock className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 font-bold block">الثبات</span>
                <strong className="text-xs font-black text-slate-900">24+ ساعة</strong>
              </div>
              <div className="p-3 bg-[#fdfbf7] rounded-xl border border-slate-100">
                <Wind className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 font-bold block">الفوحان</span>
                <strong className="text-xs font-black text-slate-900">قوي وممتد</strong>
              </div>
              <div className="p-3 bg-[#fdfbf7] rounded-xl border border-slate-100">
                <Zap className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 font-bold block">نسبة الزيوت</span>
                <strong className="text-xs font-black text-slate-900">30%+ نقية</strong>
              </div>
              <div className="p-3 bg-[#fdfbf7] rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 font-bold block">الضمان</span>
                <strong className="text-xs font-black text-slate-900">فحص وتجربة</strong>
              </div>
            </div>
          </div>

          {/* Fragrance Pyramid Notes */}
          {(product.topNotes || product.heartNotes || product.baseNotes) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ba997a]/30 space-y-3 shadow-xs">
              <h3 className="text-xs font-black text-slate-900">الهرم العطري والمكونات:</h3>
              <div className="grid grid-cols-3 gap-2.5 text-[11px]">
                {product.topNotes && (
                  <div className="p-3 bg-[#fdfbf7] rounded-xl border border-slate-100">
                    <span className="font-black text-[#3f2911] block mb-1">القمة:</span>
                    <span className="text-slate-600 font-medium leading-relaxed">{product.topNotes.join("، ")}</span>
                  </div>
                )}
                {product.heartNotes && (
                  <div className="p-3 bg-[#fdfbf7] rounded-xl border border-slate-100">
                    <span className="font-black text-[#3f2911] block mb-1">القلب:</span>
                    <span className="text-slate-600 font-medium leading-relaxed">{product.heartNotes.join("، ")}</span>
                  </div>
                )}
                {product.baseNotes && (
                  <div className="p-3 bg-[#fdfbf7] rounded-xl border border-slate-100">
                    <span className="font-black text-[#3f2911] block mb-1">القاعدة:</span>
                    <span className="text-slate-600 font-medium leading-relaxed">{product.baseNotes.join("، ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upsell Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fdfbf7] to-white border border-[#ba997a]/40 flex items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#3f2911]">
                <Gift className="w-4 h-4 text-[#ba997a]" />
                <span>هل تريد توفيراً أكبر؟</span>
              </div>
              <p className="text-[11px] text-slate-600">
                اطلب هذا العطر ضمن باقة 3 عطور (110 مل) بـ 32 د.أ فقط مع تستر هدية وشحن مجاني.
              </p>
            </div>
            <Link
              href="/#offers"
              className="px-4 py-2.5 bg-[#3f2911] text-white text-xs font-black rounded-xl shrink-0 hover:bg-[#2a1a0a] transition-all active:scale-95 shadow-xs border border-[#ba997a]/30"
            >
              شاهد العروض
            </Link>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ba997a]/20 p-3 sm:hidden shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-500 font-bold block">السعر الإجمالي:</span>
          <span className="text-base font-black text-[#3f2911]">
            {currentPrice} <span className="text-[10px] font-normal">د.أ</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="p-3 rounded-xl bg-white border border-[#ba997a] text-[#3f2911] text-xs font-black active:scale-90 transition-all shadow-xs"
            aria-label="إضافة للسلة"
          >
            <ShoppingBag className="w-4 h-4 text-[#ba997a]" />
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="px-5 py-3 rounded-xl bg-[#3f2911] text-white text-xs font-black active:scale-95 transition-all shadow-md border border-[#ba997a]/30"
          >
            اطلب الآن
          </button>
        </div>
      </div>

    </div>
  );
}
