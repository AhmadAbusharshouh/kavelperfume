"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Box, Droplets, Gift, Award, Sparkles } from "lucide-react";

export function PackagingAnatomy() {
  const [activeTab, setActiveTab] = useState<"110" | "55" | "bag" | "coaster">("110");

  const items = {
    "110": {
      title: "علبة كافيل الملكية (110 مل)",
      subtitle: "تصميم فاخر بكرتون مقوى 350 GSM وطباعة ذهبية نافرة",
      image: "/images/kavel/01_kavel-110ml-perfume-box-front.avif",
      details: [
        "ورق مقوى مزدوج لحماية الزجاجة من الصدمات والحرارة.",
        "شعار مونوغرام كافيل الذهبي منقوش بدقة فائقة.",
        "حجم 110 مل يعطيك أكثر من 1,100 رشة عطرية نقية وفائقة التركيز.",
      ],
    },
    "55": {
      title: "علبة كافيل المدمجة (55 مل)",
      subtitle: "حجم عملي ومثالي للحقيبة اليومية والسفر والمناسبات",
      image: "/images/kavel/05_kavel-55ml-perfume-box-front.avif",
      details: [
        "تصميم أسطواني أنيق يسهل حمله في أي مكان وبأي وقت.",
        "تغليف محكم وعالي الجودة يمنع أي تسريب للسائل العطري.",
        "أكثر من 550 رشة تكفي لشهور من الاستخدام اليومي الأنيق.",
      ],
    },
    bag: {
      title: "كيس تسوق وهدايا كافيل الفاخر",
      subtitle: "جاهز ومثالي للإهداء المباشر في المناسبات والأعياد",
      image: "/images/kavel/08_kavel-luxury-shopping-gift-bag.avif",
      details: [
        "حبال يد مجدولة متينة بلون ذهبي متناسق وأنيق.",
        "مساحة واسعة تستوعب حتى 5 علب عطور وبكجات مع التسترات.",
        "يُرفق مجاناً كهدية مع جميع الطلبات والبكجات.",
      ],
    },
    coaster: {
      title: "القاعدة الدائرية المخصصة للتثبيت",
      subtitle: "حماية ولمسة ديكور فاخرة على طاولة العطور والكومودينة",
      image: "/images/kavel/03_kavel-110ml-circular-coaster-label.avif",
      details: [
        "قاعدة ممتصة للاهتزاز تثبت أسفل كل زجاجة لحمايتها.",
        "تمنع انزلاق الزجاجة على الأسطح الزجاجية والرخامية.",
        "مطبوعة بختم الجودة والتركيز الأصلي لكافيل.",
      ],
    },
  };

  const current = items[activeTab];

  return (
    <div className="luxury-card p-6 sm:p-10 bg-white border border-slate-200/90 shadow-lg">
      <div className="text-right mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba997a]/15 text-[#3f2911] text-xs font-extrabold mb-2 border border-[#ba997a]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#ba997a]" />
          <span>معايير التغليف الأردني الفاخر</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
          فخامة التفاصيل: تجربة التغليف الملكي مع كل طلب
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          نهتم بأدق التفاصيل من أول رشة وحتى ملمس العلبة بين يديك.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-3">
        {[
          { key: "110", label: "علبة 110 مل الملكية" },
          { key: "55", label: "علبة 55 مل المدمجة" },
          { key: "bag", label: "كيس الهدايا الفاخر" },
          { key: "coaster", label: "القاعدة الدائرية" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              activeTab === t.key
                ? "bg-[#3f2911] text-white shadow-xs border border-[#3f2911]"
                : "bg-slate-50 text-slate-700 hover:bg-[#fdfbf7] border border-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Right (RTL Right): Details & Specs */}
        <div className="md:col-span-7 space-y-4 text-right">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {current.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
          </div>

          <ul className="space-y-3 pt-2">
            {current.details.map((d, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-[#ba997a]/20 text-[#3f2911] flex items-center justify-center shrink-0 mt-0.5 font-black text-[11px]">
                  ✓
                </div>
                <span className="leading-relaxed font-medium">{d}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ba997a]/35 flex items-center gap-3 mt-4">
            <Award className="w-7 h-7 text-[#ba997a] shrink-0" />
            <div>
              <strong className="text-xs text-[#3f2911] block font-black">معايير التصنيع الفاخر</strong>
              <span className="text-[11px] text-slate-600 font-medium">زيوت فرنسية وسويسرية نقية 100% معبأة ومغلفة في الأردن وفق أعلى المعايير القياسية.</span>
            </div>
          </div>
        </div>

        {/* Left (RTL Left): Product Packaging Visual */}
        <div className="md:col-span-5 relative">
          <div className="relative aspect-square w-full rounded-3xl bg-gradient-to-b from-[#fdfbf7] to-slate-50 border border-[#ba997a]/30 p-6 flex items-center justify-center overflow-hidden shadow-md">
            <Image
              src={current.image}
              alt={current.title}
              fill
              loading="eager"
              className="object-contain p-6 transition-all duration-500 hover:scale-105"
              sizes="380px"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
