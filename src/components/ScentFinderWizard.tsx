"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RotateCcw, Check, ShoppingBag, Sparkles, User, Heart, Compass, Moon, Sun, Flame, Wind, Droplets } from "lucide-react";
import { Product, getAllProducts } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

export function ScentFinderWizard() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [notesPref, setNotesPref] = useState<string | null>(null);

  const addSinglePerfume = useCartStore((state) => state.addSinglePerfume);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
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
    <div className="luxury-card p-6 sm:p-10 bg-white border border-[#ba997a]/35 shadow-xl overflow-hidden relative">
      <div className="max-w-3xl mx-auto space-y-6 text-right">
        
        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba997a]/15 text-[#3f2911] text-xs font-black mb-1.5 border border-[#ba997a]/30">
              <Compass className="w-3.5 h-3.5 text-[#ba997a]" />
              <span>مستشار كافيل العطري الذكي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#3f2911]">
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
              className="text-xs font-bold text-slate-500 hover:text-[#ba997a] flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة البدء</span>
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-600">
          <span>الخطوة {Math.min(step, 3)} من 3</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= s ? "w-10 bg-[#3f2911]" : "w-6 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: GENDER */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              لمن تبحث عن العطر؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "عطور رجالية فخمة", val: "رجالي", desc: "جاذبية وثبات حاد وفوحان قوي", icon: User },
                { label: "عطور نسائية أنيقة", val: "نسائي", desc: "نعومة وأنوثة ساحرة وجذابة", icon: Heart },
                { label: "عطور للجنسين (Unisex)", val: "للجنسين", desc: "تناغم نيش راقٍ ومميز", icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setGender(item.val);
                      setStep(2);
                    }}
                    className="p-5 rounded-2xl border border-slate-200 bg-[#fdfbf7]/50 hover:bg-[#fdfbf7] hover:border-[#ba997a] transition-all text-right space-y-2 group cursor-pointer active:scale-95 shadow-2xs hover:shadow-md"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#ba997a]/30 flex items-center justify-center text-[#ba997a] group-hover:bg-[#3f2911] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#ba997a] block transition-colors">
                        {item.label}
                      </strong>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: VIBE / OCCASION */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              ما هي طبيعة الاستخدام المفضلة؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "سهرات ومناسبات رسمية وأفراح", val: "formal", desc: "فوحان قوي وتركيز ممتد", icon: Moon },
                { label: "عمل ودوام ويومي خفيف", val: "daily", desc: "أناقة هادئة ومريحة", icon: Sun },
                { label: "صيفي ومنعش وحيوي", val: "summer", desc: "حمضيات ونسمات بحرية باردة", icon: Wind },
                { label: "شتوي دافئ وجذاب", val: "winter", desc: "توابل وفانيليا وأخشاب غنية", icon: Flame },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setVibe(item.val);
                      setStep(3);
                    }}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-[#fdfbf7]/50 hover:bg-[#fdfbf7] hover:border-[#ba997a] transition-all text-right flex items-center gap-3.5 group cursor-pointer active:scale-95 shadow-2xs hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#ba997a]/30 flex items-center justify-center text-[#ba997a] group-hover:bg-[#3f2911] group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#ba997a] block transition-colors">
                        {item.label}
                      </strong>
                      <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SCENT NOTES PREFERENCE */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
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
                  className="p-4 rounded-2xl border border-slate-200 bg-[#fdfbf7]/60 hover:bg-[#3f2911] hover:text-white hover:border-[#3f2911] transition-all text-center group font-black text-xs cursor-pointer active:scale-95 shadow-2xs"
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
                <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold">
                  عثرنا على أفضل الترشيحات المتوافقة مع ذوقك ({gender} / {notesPref})
                </span>
              </div>
              <button
                type="button"
                onClick={resetWizard}
                className="text-xs font-black text-emerald-800 underline cursor-pointer"
              >
                تغيير الخيارات
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {recommendations.map((p) => (
                <div key={p.id} className="bg-white p-3.5 rounded-2xl border border-[#ba997a]/30 text-right flex flex-col justify-between space-y-2 shadow-xs hover:shadow-md transition-shadow">
                  <div className="relative aspect-square w-full rounded-xl bg-slate-50 p-2 overflow-hidden border border-slate-100">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="120px" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 line-clamp-1">{p.name}</h4>
                    <span className="text-[11px] font-black text-[#3f2911] block mt-1">{p.effectivePrice110} د.أ <span className="text-[10px] font-normal text-slate-500">(110 مل)</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addSinglePerfume(p, "110ml");
                      toast.success(`تمت إضافة ${p.name} إلى السلة`);
                      setDrawerOpen(true);
                    }}
                    className="w-full py-2 bg-[#3f2911] hover:bg-[#2a1a0a] text-white text-[11px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <ShoppingBag className="w-3 h-3 text-[#ba997a]" />
                    <span>إضافة للسلة</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fdfbf7] to-white border border-[#ba997a]/40 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div>
                <strong className="text-xs sm:text-sm text-[#3f2911] block font-black">
                  هل ترغب بتجربة كل هذه العطور معاً؟
                </strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  اطلبها في باقة 3 عطور (110 مل) بـ 32 د.أ فقط مع شحن مجاني وتستر هدية!
                </p>
              </div>
              <a
                href="/#offers"
                className="px-5 py-2.5 bg-[#3f2911] text-white text-xs font-black rounded-xl hover:bg-[#2a1a0a] transition active:scale-95 shadow-xs"
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
