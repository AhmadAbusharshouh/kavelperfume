"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Truck, Check, Clock, Wind, Award, Zap } from "lucide-react";
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

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-[#3f2911]">العطر غير موجود</h1>
        <p className="text-xs text-slate-500">قد يكون الرابط خاطئاً أو تم نقل المنتج.</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3f2911] text-white rounded-xl text-xs font-bold"
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
  };

  const handleBuyNow = () => {
    addSinglePerfume(product, selectedSize);
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12 pb-28 sm:pb-16">
      
      {/* Back Button */}
      <div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#ba997a] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لجميع العطور</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-white border border-slate-200 shadow-lg p-4 sm:p-6 overflow-hidden flex items-center justify-center">
            <Image
              src={galleryImages[activeImageIdx]}
              alt={product.name}
              fill
              priority
              className="object-contain p-3 sm:p-4 transition-transform duration-300"
              sizes="(max-width: 1024px) 100vw, 550px"
            />
            {surcharge > 0 && (
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] sm:text-xs font-bold rounded-xl shadow-xs">
                صنف فاخر (+{surcharge} د.أ)
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-square rounded-2xl bg-white border p-1 sm:p-1.5 transition-all overflow-hidden cursor-pointer active:scale-95 ${
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
        <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-right">
          
          {/* Categories Pill List */}
          <div className="flex flex-wrap gap-1.5">
            {product.categories.map((c) => (
              <span key={c} className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                {c}
              </span>
            ))}
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#3f2911] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 sm:mt-1" dir="ltr">
              {product.nameEn}
            </p>
          </div>

          {/* Pricing Row */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#fdfbf7] border border-[#ba997a]/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">السعر الحالي ({selectedSize})</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
                {currentPrice} <span className="text-xs sm:text-sm font-bold text-slate-600">د.أ</span>
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs text-slate-400 line-through block">
                {is110 ? "32 د.أ" : "22 د.أ"}
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-700">وفر 50% مع كافيل</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">اختر حجم العبوة:</label>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedSize("110ml")}
                className={`p-3 sm:p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer active:scale-98 min-h-[58px] ${
                  is110
                    ? "bg-white border-[#ba997a] ring-2 ring-[#ba997a]/30 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-white text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-extrabold text-slate-900">110 مل (الأكثر طلباً)</strong>
                  {is110 && <Check className="w-4 h-4 text-[#ba997a]" />}
                </div>
                <span className="text-xs font-bold text-[#3f2911] mt-1">
                  {product.effectivePrice110} د.أ
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSize("55ml")}
                className={`p-3 sm:p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer active:scale-98 min-h-[58px] ${
                  !is110
                    ? "bg-white border-[#ba997a] ring-2 ring-[#ba997a]/30 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-white text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-extrabold text-slate-900">55 مل (حجم عملي)</strong>
                  {!is110 && <Check className="w-4 h-4 text-[#ba997a]" />}
                </div>
                <span className="text-xs font-bold text-[#3f2911] mt-1">
                  {product.effectivePrice55} د.أ
                </span>
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="py-3.5 px-6 rounded-xl bg-[#3f2911] hover:bg-[#2a1a0a] text-white text-xs sm:text-sm font-extrabold shadow-md transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[48px]"
            >
              <Truck className="w-4 h-4 text-[#ba997a]" />
              <span>اطلب الآن (الدفع عند الاستلام)</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="py-3.5 px-6 rounded-xl bg-white border border-[#ba997a] hover:bg-[#ba997a]/10 text-[#3f2911] text-xs sm:text-sm font-bold shadow-xs transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[48px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>إضافة للسلة</span>
            </button>
          </div>

          {/* Fragrance Performance & Quality Radar */}
          <div className="luxury-card p-4 sm:p-5 bg-white border border-slate-200 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900">مواصفات وأداء تركيبة كافيل:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Clock className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 block">الثبات</span>
                <strong className="text-xs font-bold text-slate-900">24+ ساعة</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Wind className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 block">الفوحان</span>
                <strong className="text-xs font-bold text-slate-900">قوي وممتد</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Zap className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 block">نسبة الزيوت</span>
                <strong className="text-xs font-bold text-slate-900">30%+ نقية</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <Award className="w-4 h-4 mx-auto text-[#ba997a] mb-1" />
                <span className="text-[10px] text-slate-500 block">الجودة</span>
                <strong className="text-xs font-bold text-slate-900">ضمان ذهبي</strong>
              </div>
            </div>
          </div>

          {/* Fragrance Pyramid Notes */}
          {(product.topNotes || product.heartNotes || product.baseNotes) && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900">الهرم العطري والمكونات:</h3>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {product.topNotes && (
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-800 block mb-0.5">القمة:</span>
                    <span className="text-slate-600">{product.topNotes.join("، ")}</span>
                  </div>
                )}
                {product.heartNotes && (
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-800 block mb-0.5">القلب:</span>
                    <span className="text-slate-600">{product.heartNotes.join("، ")}</span>
                  </div>
                )}
                {product.baseNotes && (
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-800 block mb-0.5">القاعدة:</span>
                    <span className="text-slate-600">{product.baseNotes.join("، ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upsell Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#fdfbf7] to-white border border-[#ba997a]/40 flex items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-[#3f2911] block">
                هل تريد توفيراً أكبر؟
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-600">
                اطلب هذا العطر ضمن باقة 3 عطور (110 مل) بـ 32 د.أ فقط مع تستر مجاني وتوصيل مجاني.
              </p>
            </div>
            <Link
              href="/#offers"
              className="px-3.5 sm:px-4 py-2 bg-[#3f2911] text-white text-xs font-bold rounded-xl shrink-0 hover:bg-[#2a1a0a] transition-transform active:scale-95"
            >
              شاهد العروض
            </Link>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-500 block">السعر الإجمالي:</span>
          <span className="text-base font-extrabold text-[#3f2911]">
            {currentPrice} <span className="text-[10px] font-normal">د.أ</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-3 py-2.5 rounded-xl bg-white border border-[#ba997a] text-[#3f2911] text-xs font-bold active:scale-90 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="px-4 py-2.5 rounded-xl bg-[#3f2911] text-white text-xs font-bold active:scale-95 transition-transform"
          >
            اطلب الآن
          </button>
        </div>
      </div>

    </div>
  );
}
