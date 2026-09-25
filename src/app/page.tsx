"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, ShieldCheck, Gift, Truck, Star, Sparkles, CheckCircle2, Droplets, Clock, Flame } from "lucide-react";
import { DEFAULT_OFFERS, BundleOffer } from "@/lib/offers";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { BundleModal } from "@/components/BundleModal";
import { ScentFinderWizard } from "@/components/ScentFinderWizard";
import { PackagingAnatomy } from "@/components/PackagingAnatomy";
import { FaqSection } from "@/components/FaqSection";

export default function HomePage() {
  const [selectedBundle, setSelectedBundle] = useState<BundleOffer | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  
  const allProducts = useMemo(() => getAllProducts(), []);

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

  // Dynamic filter for featured products
  const filteredProducts = useMemo(() => {
    if (activeCategory === "الكل") {
      return getFeaturedProducts(12);
    }
    return allProducts
      .filter((p) => p.categories.includes(activeCategory))
      .slice(0, 12);
  }, [activeCategory, allProducts]);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* SECTION 1: LUXURY HERO */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12 bg-gradient-to-b from-white via-[#fdfbf7] to-[#FAFAF9] border-b border-[#ba997a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ba997a]/15 text-[#3f2911] text-xs font-bold border border-[#ba997a]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#ba997a]" />
                <span>عطور مستوحاة بتركيز فائق وثبات يدوم طويلاً</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3f2911] leading-[1.25] tracking-tight">
                عطور مستوحاة بثبات استثنائي بأيدٍ أردنية
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                في <strong className="text-[#3f2911] font-extrabold">كافيل بيرفيوم</strong> نبتكر تركيبات عطرية غنية بنسبة زيوت نقية تتجاوز 30% تمنحك ثباتاً يدوم لأكثر من 24 ساعة وفوحاناً راقياً، في زجاجات فاخرة وتغليف ملكي يليق بإطلالتك.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#offers"
                  className="px-6 py-3.5 rounded-xl bg-[#3f2911] text-white text-xs sm:text-sm font-extrabold hover:bg-[#2a1a0a] transition-all shadow-md inline-flex items-center gap-2 active:scale-98 border border-[#ba997a]/40"
                >
                  <Gift className="w-4 h-4 text-[#ba997a]" />
                  <span>عروض وبكجات التوفير</span>
                </a>

                <a
                  href="#wizard"
                  className="px-6 py-3.5 rounded-xl bg-white border border-[#ba997a] text-[#3f2911] text-xs sm:text-sm font-extrabold hover:bg-[#fdfbf7] transition-all inline-flex items-center gap-2 active:scale-98 shadow-2xs"
                >
                  <span>مكتشف العطور الذكي</span>
                  <ArrowLeft className="w-4 h-4 text-[#ba997a]" />
                </a>
              </div>

              {/* Trust Proof Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80">
                <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80 text-center">
                  <span className="text-xl sm:text-2xl font-black text-[#3f2911] block">30%+</span>
                  <span className="text-[11px] text-slate-600 font-bold block mt-0.5">تركيز زيوت نقية</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80 text-center">
                  <span className="text-xl sm:text-2xl font-black text-[#3f2911] block">100+</span>
                  <span className="text-[11px] text-slate-600 font-bold block mt-0.5">عطر عالمي ونيش</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/80 text-center">
                  <span className="text-xl sm:text-2xl font-black text-[#3f2911] block">24-48h</span>
                  <span className="text-[11px] text-slate-600 font-bold block mt-0.5">توصيل لكافة المحافظات</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#ba997a]/30 shadow-2xl p-4 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#fdfbf7] to-white/40" />
                <Image
                  src="/images/kavel/08_kavel-luxury-shopping-gift-bag.avif"
                  alt="كافيل بيرفيوم / التغليف الفاخر وأكياس الهدايا"
                  fill
                  priority
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-105 relative z-10"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#ba997a]/30 flex items-center justify-between shadow-md z-20">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 block">تغليف كافيل الملكي</span>
                    <span className="text-[10px] text-slate-500 font-medium">علبة فاخرة + كيس هدايا مخصص مع كل طلب</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black">
                    شحن مجاني للبكجات
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: BUNDLE OFFERS (BEST VALUE) */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba997a]/15 text-[#3f2911] text-xs font-extrabold mb-2 border border-[#ba997a]/30">
            <Gift className="w-3.5 h-3.5 text-[#ba997a]" />
            <span>باقات التوفير الكبرى</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
            عروض البكجات الأكثر طلباً وتوفيراً
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            اختر باقتك المفضلة من عطور كافيل (55 مل أو 110 مل) مع تستر مجاني وتوصيل مجاني لجميع محافظات المملكة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_OFFERS.map((offer) => {
            const isPopular = offer.popular;
            return (
              <div
                key={offer.id}
                className={`flex flex-col justify-between relative overflow-hidden bg-white rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
                  isPopular
                    ? "border-2 border-[#ba997a] shadow-xl ring-2 ring-[#ba997a]/20"
                    : "border border-slate-200 shadow-md hover:border-[#ba997a]/60 hover:shadow-lg"
                }`}
              >
                <div>
                  {/* Top Badge Row (Proper dedicated layout with zero overlapping) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      باقة {offer.count} عطور
                    </span>
                    {offer.badge && (
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-black shadow-2xs ${
                          isPopular
                            ? "bg-[#3f2911] text-[#ba997a] border border-[#ba997a]/40"
                            : "bg-[#fdfbf7] text-[#3f2911] border border-[#ba997a]/30"
                        }`}
                      >
                        {offer.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-0.5 text-right">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 text-right font-medium" dir="ltr">
                    {offer.titleEn}
                  </p>

                  {/* Offer Image Showcase */}
                  <div className="relative aspect-16/9 w-full rounded-2xl bg-gradient-to-b from-[#fdfbf7] to-slate-50 mb-4 p-2 overflow-hidden flex items-center justify-center border border-slate-100">
                    <Image
                      src={
                        offer.id === "bundle-5-110"
                          ? "/images/kavel/08_kavel-luxury-shopping-gift-bag.avif"
                          : offer.id === "bundle-4-combo"
                          ? "/images/kavel/02_kavel-110ml-perfume-box-details.avif"
                          : offer.id === "bundle-5-55"
                          ? "/images/kavel/06_kavel-55ml-perfume-box-details.avif"
                          : offer.size === "55"
                          ? "/images/kavel/05_kavel-55ml-perfume-box-front.avif"
                          : "/images/kavel/01_kavel-110ml-perfume-box-front.avif"
                      }
                      alt={offer.title}
                      fill
                      loading="eager"
                      className="object-contain p-2 transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    {offer.freeShipping && (
                      <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-black shadow-2xs">
                        توصيل مجاني
                      </span>
                    )}
                  </div>

                  {/* Perks Checklist */}
                  <ul className="space-y-2 mb-6 text-xs text-slate-700 text-right">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ba997a] shrink-0" />
                      <span>عدد {offer.count} عطور من اختيارك بالكامل</span>
                    </li>
                    {offer.gift && (
                      <li className="flex items-center gap-2 font-bold text-emerald-800">
                        <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{offer.gift}</span>
                      </li>
                    )}
                    {offer.freeShipping && (
                      <li className="flex items-center gap-2 font-bold text-[#3f2911]">
                        <Truck className="w-4 h-4 text-[#ba997a] shrink-0" />
                        <span>توصيل مجاني سريع لباب بيتك</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Bottom Price & Select Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#3f2911]">
                      {offer.priceJod} <span className="text-xs font-bold text-slate-500">د.أ</span>
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-bold">شامل التوصيل والهدية</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBundle(offer)}
                    className="px-5 py-2.5 rounded-xl bg-[#3f2911] hover:bg-[#2a1a0a] text-white text-xs font-extrabold transition-all shadow-sm inline-flex items-center gap-1.5 active:scale-95 cursor-pointer border border-[#ba997a]/30 min-h-[40px]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#ba997a]" />
                    <span>تخصيص الباقة</span>
                  </button>
                </div>
              </div>
            );
          })}
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
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#ba997a] hover:text-[#3f2911] transition flex items-center gap-1"
          >
            <span>عرض كافة العطور (100+ عطر)</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 pb-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                activeCategory === cat
                  ? "bg-[#3f2911] text-white shadow-xs border border-[#3f2911]"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-[#fdfbf7] hover:border-[#ba997a]/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 5: PACKAGING CRAFTSMANSHIP */}
      <section id="packaging" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackagingAnatomy />
      </section>

      {/* SECTION 6: CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-right mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-extrabold mb-2 border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>تقييم 4.9/5 من أكثر من 2,500 عميل في الأردن</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
            آراء وتقييمات زبائن كافيل
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            تجارب حقيقية من عملائنا في عمان، إربد، الزرقاء وكافة محافظات المملكة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="luxury-card p-5 bg-white border border-slate-200 space-y-3 text-right">
            <div className="flex items-center gap-1 text-amber-500 justify-end">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "طلبت باقة الـ 3 عطور (110 مل) وجربت إيماجينيشن وبلاك أفغانو ، الثبات خرافي لليوم الثاني على الملابس والتوصيل وصلني ثاني يوم في عمان."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-slate-900">محمد العبداللات</span>
              <span className="text-slate-400 font-medium">عمان / الجبيهة</span>
            </div>
          </div>

          <div className="luxury-card p-5 bg-white border border-slate-200 space-y-3 text-right">
            <div className="flex items-center gap-1 text-amber-500 justify-end">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "التغليف جداً فخم وأنيق وكيس الهدايا مرتب وراقي ، والفوحان يوازي الأصلي تماماً بدون أي مبالغة. شكراً كافيل على الأمانة."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-slate-900">سارة الشوابكة</span>
              <span className="text-slate-400 font-medium">إربد / الحي الشرقي</span>
            </div>
          </div>

          <div className="luxury-card p-5 bg-white border border-slate-200 space-y-3 text-right">
            <div className="flex items-center gap-1 text-amber-500 justify-end">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "الشراء سهل وسريع بدون تعقيدات تسجيل ورقم التتبع وصلني فوراً على الواتساب. أنصح وبشدة بعطر جود أوف فاير وسوفاج."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-slate-900">أحمد الحنيطي</span>
              <span className="text-slate-400 font-medium">الزرقاء / الزرقاء الجديدة</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ ACCORDION */}
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
