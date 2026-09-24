"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Box, Droplets, Gift, Award } from "lucide-react";

export function PackagingAnatomy() {
  const [activeTab, setActiveTab] = useState<"110" | "55" | "bag" | "coaster">("110");

  const items = {
    "110": {
      title: "علبة كافيل الملكية (110 مل)",
      subtitle: "تصميم فاخر بكرتون مقوى 350 GSM وطباعة ذهبية بارزة",
      image: "/images/kavel/01_kavel-110ml-perfume-box-front.avif",
      details: [
        "ورق مقوى مزدوج لحماية الزجاجة من الصدمات والحرارة.",
        "شعار مونوغرام كافيل الذهبي منقوش بدقة فائقة.",
        "حجم 110 مل يعطيك أكثر من 1,100 رشة عطرية نقية.",
      ],
    },
    "55": {
      title: "علبة كافيل المدمجة (55 مل)",
      subtitle: "حجم عملي ومثالي للحقيبة اليدوية والسفر والسيارة",
      image: "/images/kavel/05_kavel-55ml-perfume-box-front.avif",
      details: [
        "تصميم أسطواني أنيق يسهل حمله في أي مكان.",
        "تغليف محكم يمنع أي تسريب للسائل العطري.",
        "أكثر من 550 رشة تكفي لشهور من الاستخدام اليومي.",
      ],
    },
    bag: {
      title: "كيس تسوق وهدايا كافيل الملكي",
      subtitle: "جاهز ومثالي للإهداء في المناسبات والأعياد",
      image: "/images/kavel/08_kavel-luxury-shopping-gift-bag.avif",
      details: [
        "حبال يد مجدولة متينة بلون ذهبي متناسق.",
        "مساحة واسعة تستوعب حتى 5 علب عطور وبكجات.",
        "يُرفق مجاناً مع جميع الطلبات والبكجات.",
      ],
    },
    coaster: {
      title: "القاعدة الدائرية المخصصة للتثبيت",
      subtitle: "حماية ولمسة ديكور فاخرة على طاولة العطور",
      image: "/images/kavel/03_kavel-110ml-circular-coaster-label.avif",
      details: [
        "قاعدة ممتصة للاهتزاز تثبت أسفل كل زجاجة.",
        "تمنع انزلاق الزجاجة على الأسطح الزجاجية والرخامية.",
        "مطبوعة بختم الجودة الملكي لكافيل.",
      ],
    },
  };

  const current = items[activeTab];

  return (
    <div className="luxury-card p-6 sm:p-10 bg-white border border-slate-200">
      <div className="text-right mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
          تشريح وجودة تغليف كافيل (Packaging Anatomy)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          نهتم بأدق التفاصيل من أول رشة وحتى ملمس العلبة بين يديك.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-3">
        {[
          { key: "110", label: "علبة 110 مل" },
          { key: "55", label: "علبة 55 مل" },
          { key: "bag", label: "كيس الهدايا" },
          { key: "coaster", label: "القاعدة الدائرية" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.key
                ? "bg-[#3f2911] text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left (RTL Right): Details & Specs */}
        <div className="md:col-span-7 space-y-4 text-right">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {current.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
          </div>

          <ul className="space-y-2.5 pt-2">
            {current.details.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <div className="w-5 h-5 rounded-full bg-[#ba997a]/20 text-[#3f2911] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✓
                </div>
                <span className="leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ba997a]/30 flex items-center gap-3 mt-4">
            <Award className="w-6 h-6 text-[#ba997a] shrink-0" />
            <div>
              <strong className="text-xs text-[#3f2911] block font-bold">معايير التصنيع الفاخر</strong>
              <span className="text-[11px] text-slate-600">زيوت أوروبية نقية 100% معبأة ومغلفة في الأردن وفق أعلى المعايير الصحية.</span>
            </div>
          </div>
        </div>

        {/* Right (RTL Left): Product Packaging Visual */}
        <div className="md:col-span-5 relative">
          <div className="relative aspect-square w-full rounded-3xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-center overflow-hidden shadow-sm">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-contain p-4 transition-all duration-500 hover:scale-105"
              sizes="350px"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
