"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ShieldCheck, Gift, Truck, Star, Layers, Award } from "lucide-react";
import { DEFAULT_OFFERS, BundleOffer } from "@/lib/offers";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { BundleModal } from "@/components/BundleModal";
import { ScentFinderWizard } from "@/components/ScentFinderWizard";
import { ScentLayeringGuide } from "@/components/ScentLayeringGuide";
import { PackagingAnatomy } from "@/components/PackagingAnatomy";
import { FaqSection } from "@/components/FaqSection";

export default function HomePage() {
  const [selectedBundle, setSelectedBundle] = useState<BundleOffer | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const featured = getFeaturedProducts(8);

  const categories = [
    "الكل",
    "رجالي",
    "نسائي",
    "للجنسين",
    "شتوي",
    "صيفي",
    "عطور النيش الفاخرة",
    "عود وبخور",
    "فانيليا",
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* SECTION 1: LUXURY HERO */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 bg-gradient-to-b from-white via-[#fdfbf7] to-[#FAFAF9] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3f2911] leading-tight tracking-tight">
                عطور مستوحاة بثبات استثنائي بأيدٍ أردنية
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                في كافيل بيرفيوم نبتكر تركيبات عطرية غنية بنسبة زيوت نقية تتجاوز 30% تمنحك ثباتاً يدوم طويلاً وفوحاناً راقياً، في زجاجات فاخرة وتغليف متقن يليق بإطلالتك.
              </p>

              {/* CTAs & Key Numbers */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#offers"
                  className="px-6 py-3.5 rounded-xl bg-[#3f2911] text-white text-xs sm:text-sm font-bold hover:bg-[#2a1a0a] transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Gift className="w-4 h-4 text-[#ba997a]" />
                  <span>عروض وبكجات التوفير</span>
                </a>

                <a
                  href="#wizard"
                  className="px-6 py-3.5 rounded-xl bg-white border border-[#ba997a] text-[#3f2911] text-xs sm:text-sm font-bold hover:bg-[#ba997a]/10 transition-all inline-flex items-center gap-2"
                >
                  <span>مكتشف العطور الذكي</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
              </div>

              {/* Value Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80">
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#3f2911] block">30%+</span>
                  <span className="text-[11px] text-slate-500 font-medium">تركيز الزيوت العطرية</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#3f2911] block">100+</span>
                  <span className="text-[11px] text-slate-500 font-medium">عطر عالمي ونيش</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#3f2911] block">24-48h</span>
                  <span className="text-[11px] text-slate-500 font-medium">توصيل لكافة المحافظات</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase (Kavel Luxury Packaging Assets) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl p-3 flex items-center justify-center group">
                <Image
                  src="/images/kavel/08_kavel-luxury-shopping-gift-bag.avif"
                  alt="كافيل بيرفيوم / التغليف الفاخر وأكياس الهدايا"
                  fill
                  priority
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">تغليف كافيل الملكي</span>
                    <span className="text-[10px] text-slate-500">علبة مخصصة + كيس هدايا مع كل طلب</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#ba997a]/20 text-[#3f2911] text-[10px] font-extrabold">
                    شحن لجميع المحافظات
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: BUNDLE OFFERS (BEST VALUE) */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911] mb-2 text-right">
          عروض البكجات الأكثر طلباً وتوفيراً
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-2xl text-right">
          اختر باقتك المفضلة من عطور كافيل (55 مل أو 110 مل) مع تستر مجاني وتوصيل مجاني لجميع محافظات المملكة.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className={`luxury-card p-6 flex flex-col justify-between relative overflow-hidden bg-white border ${
                offer.popular ? "border-[#ba997a] shadow-lg" : "border-slate-200"
              }`}
            >
              {offer.badge && (
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold shadow-xs ${
                      offer.popular
                        ? "bg-[#3f2911] text-[#ba997a]"
                        : "bg-[#ba997a]/20 text-[#3f2911]"
                    }`}
                  >
                    {offer.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4" dir="ltr">
                  {offer.titleEn}
                </p>

                {/* Offer Image Showcase */}
                <div className="relative aspect-16/9 w-full rounded-2xl bg-slate-50 mb-4 p-2 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/kavel/01_kavel-110ml-perfume-box-front.avif"
                    alt={offer.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>

                {/* Perks Checklist */}
                <ul className="space-y-2 mb-6 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#ba997a]" />
                    <span>عدد {offer.count} عطور من اختيارك بالكامل</span>
                  </li>
                  {offer.gift && (
                    <li className="flex items-center gap-2 font-bold text-emerald-700">
                      <Gift className="w-4 h-4" />
                      <span>{offer.gift}</span>
                    </li>
                  )}
                  {offer.freeShipping && (
                    <li className="flex items-center gap-2 font-bold text-blue-700">
                      <Truck className="w-4 h-4" />
                      <span>توصيل مجاني لباب البيت</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Bottom Price & Select Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-2xl font-extrabold text-[#3f2911]">
                    {offer.priceJod} <span className="text-xs font-bold text-slate-500">د.أ</span>
                  </span>
                  <span className="block text-[10px] text-slate-400">شامل الضريبة</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBundle(offer)}
                  className="px-5 py-2.5 rounded-xl bg-[#3f2911] hover:bg-[#2a1a0a] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#ba997a]" />
                  <span>تخصيص الباقة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SCENT FINDER WIZARD */}
      <section id="wizard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScentFinderWizard />
      </section>

      {/* SECTION 4: BEST SELLERS & CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div className="text-right">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
              العطور الأكثر طلباً وشهرة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              أفضل تركيبات كافيل المستوحاة من أشهر الماركات العالمية بتركيز وثبات ممتد.
            </p>
          </div>
          <a
            href="/catalog"
            className="text-xs font-bold text-[#ba997a] hover:text-[#3f2911] transition flex items-center gap-1"
          >
            <span>عرض كافة العطور (100+ عطر)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Categories Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 pb-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat
                  ? "bg-[#3f2911] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 5: SCENT LAYERING GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScentLayeringGuide />
      </section>

      {/* SECTION 6: PACKAGING ANATOMY */}
      <section id="packaging" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackagingAnatomy />
      </section>

      {/* SECTION 7: CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911] mb-2 text-right">
          آراء وتقييمات زبائن كافيل في الأردن
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-2xl text-right">
          تجارب حقيقية من عملائنا في عمان، إربد، الزرقاء وكافة محافظات المملكة.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="luxury-card p-5 bg-white border border-slate-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "طلبت باقة الـ 3 عطور (110 مل) وجربت إيماجينيشن وبلاك أفغانو ، الثبات خرافي لليوم الثاني على الملابس والتوصيل وصلني ثاني يوم في عمان."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900">محمد العبداللات</span>
              <span className="text-slate-400">عمان / الجبيهة</span>
            </div>
          </div>

          <div className="luxury-card p-5 bg-white border border-slate-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "التغليف جداً فخم وأنيق وكيس الهدايا مرتب وراقي ، والفوحان يوازي الأصلي تماماً بدون أي مبالغة. شكراً كافيل على الأمانة."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900">سارة الشوابكة</span>
              <span className="text-slate-400">إربد / الحي الشرقي</span>
            </div>
          </div>

          <div className="luxury-card p-5 bg-white border border-slate-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "الشراء سهل وسريع بدون تعقيدات تسجيل ورقم التتبع وصلني فوراً على الواتساب. أنصح وبشدة بعطر جود أوف فاير وسوفاج."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-900">أحمد الحنيطي</span>
              <span className="text-slate-400">الزرقاء / الزرقاء الجديدة</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ ACCORDION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqSection />
      </section>

      {/* Bundle Customizer Modal */}
      {selectedBundle && (
        <BundleModal
          offer={selectedBundle}
          isOpen={true}
          onClose={() => setSelectedBundle(null)}
        />
      )}

    </div>
  );
}
