"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, RotateCcw, Check, ShoppingBag, ArrowLeft, Heart, Flame, Sun, Moon } from "lucide-react";
import { Product, getAllProducts } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

export function ScentFinderWizard() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [notesPref, setNotesPref] = useState<string | null>(null);

  const addSinglePerfume = useCartStore((state) => state.addSinglePerfume);
  const allProducts = getAllProducts();

  const resetWizard = () => {
    setStep(1);
    setGender(null);
    setVibe(null);
    setNotesPref(null);
  };

  // Recommendations Logic based on user choices
  const recommendations: Product[] = allProducts.filter((p) => {
    if (gender && gender !== "all") {
      if (gender === "رجالي" && !p.categories.includes("رجالي")) return false;
      if (gender === "نسائي" && !p.categories.includes("نسائي")) return false;
      if (gender === "للجنسين" && !p.categories.includes("للجنسين")) return false;
    }

    if (notesPref) {
      const match = p.categories.some((c) => c.includes(notesPref) || notesPref.includes(c));
      if (!match) return false;
    }

    return true;
  }).slice(0, 4);

  return (
    <div className="luxury-card p-6 sm:p-10 bg-white border border-[#ba997a]/40 shadow-xl overflow-hidden relative">
      <div className="max-w-3xl mx-auto space-y-6 text-right">
        
        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3f2911]">
              مكتشف العطور الذكي من كافيل
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              أجب عن 3 أسئلة بسيطة وسنرشح لك العطر الأنسب لذوقك ومناسبتك
            </p>
          </div>
          {step > 1 && (
            <button
              type="button"
              onClick={resetWizard}
              className="text-xs font-bold text-slate-500 hover:text-[#ba997a] flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة البدء</span>
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>الخطوة {step} من 3</span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  step >= s ? "bg-[#3f2911]" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: GENDER */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-sm font-extrabold text-slate-900">
              لمن تبحث عن العطر؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "عطور رجالية فخمة", val: "رجالي", desc: "جاذبية وثبات حاد" },
                { label: "عطور نسائية أنيقة", val: "نسائي", desc: "نعومة وأنوثة ساحرة" },
                { label: "عطور للجنسين (Unisex)", val: "للجنسين", desc: "تناغم نيش راقٍ" },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    setGender(item.val);
                    setStep(2);
                  }}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-[#fdfbf7] hover:border-[#ba997a] transition-all text-right space-y-1 group cursor-pointer"
                >
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#ba997a] block">
                    {item.label}
                  </strong>
                  <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: VIBE / OCCASION */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-sm font-extrabold text-slate-900">
              ما هي طبيعة الاستخدام المفضلة؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "سهرات ومناسبات رسمية وأفراح", val: "formal", desc: "فوحان قوي يدوم لليوم التالي" },
                { label: "عمل ودوام ويومي خفيف", val: "daily", desc: "أناقة هادئة وغير مزعجة" },
                { label: "صيفي ومنعش وحيوي", val: "summer", desc: "حمضيات ونسمات بحرية باردة" },
                { label: "شتوي دافئ وجذاب", val: "winter", desc: "توابل وفانيليا وأخشاب غنية" },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    setVibe(item.val);
                    setStep(3);
                  }}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-[#fdfbf7] hover:border-[#ba997a] transition-all text-right space-y-1 group cursor-pointer"
                >
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#ba997a] block">
                    {item.label}
                  </strong>
                  <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SCENT NOTES PREFERENCE */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-sm font-extrabold text-slate-900">
              ما هو المكون العطري الأقرب لقلبك؟
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "فانيليا وسويت", val: "فانيليا" },
                { label: "عود وبخور شرقي", val: "عود" },
                { label: "حمضيات ومنعش", val: "حمضيات" },
                { label: "توباكو وجلود", val: "جلدي" },
                { label: "توابل وحار", val: "توابل" },
                { label: "زهور وبودري", val: "زهور" },
                { label: "أخشاب وعنبر", val: "خشبي" },
                { label: "عطور النيش", val: "عطور النيش الفاخرة" },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    setNotesPref(item.val);
                    setStep(4);
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-[#3f2911] hover:text-white transition-all text-center group font-bold text-xs cursor-pointer"
                >
                  <span className="group-hover:text-white transition-colors">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: RECOMMENDATIONS RESULTS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-bold">
                  عثرنا على أفضل الترشيحات المتوافقة مع ذوقك ({gender} / {notesPref})
                </span>
              </div>
              <button
                type="button"
                onClick={resetWizard}
                className="text-xs font-bold text-emerald-800 underline cursor-pointer"
              >
                تغيير الخيارات
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations.map((p) => (
                <div key={p.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-right flex flex-col justify-between space-y-2">
                  <div className="relative aspect-square w-full rounded-xl bg-white p-2 overflow-hidden">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="120px" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{p.name}</h4>
                    <span className="text-[11px] font-extrabold text-[#3f2911] block mt-1">{p.effectivePrice110} د.أ (110 مل)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addSinglePerfume(p, "110ml");
                      toast.success(`تمت إضافة ${p.name} إلى السلة`);
                    }}
                    className="w-full py-2 bg-[#3f2911] hover:bg-[#2a1a0a] text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3 text-[#ba997a]" />
                    <span>إضافة للسلة</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#ba997a]/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <strong className="text-xs text-[#3f2911] block font-extrabold">
                  هل ترغب بتجربة كل هذه العطور؟
                </strong>
                <p className="text-[11px] text-slate-600">
                  اطلبها في باقة 3 عطور (110 مل) بـ 32 د.أ فقط مع شحن مجاني وتستر هدية!
                </p>
              </div>
              <a
                href="/#offers"
                className="px-5 py-2.5 bg-[#3f2911] text-white text-xs font-bold rounded-xl hover:bg-[#2a1a0a] transition"
              >
                تخصيص الباقة الآن
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
