"use client";

import Image from "next/image";
import { Plus, ShoppingBag, Check, Layers, ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

export function ScentLayeringGuide() {
  const addSinglePerfume = useCartStore((state) => state.addSinglePerfume);

  const layeringDuos = [
    {
      title: "ثنائي السحر والدفء",
      titleEn: "Sweet Vanilla & Spicy Allure",
      slug1: "bianco-latte",
      name1: "بيانكو لاتيه (فانيليا وكراميل)",
      img1: "/images/perfumes/bianco-latte.avif",
      slug2: "jean-paul-gaultier-ultra-male",
      name2: "ألترا ميل (قرفة ولافندر وفواكه)",
      img2: "/images/perfumes/jean-paul-gaultier-ultra-male.avif",
      description: "طبقة ناعمة من حلاوة الكراميل والفانيليا تعلوها نفحات القرفة والفواكه المنعشة لأطول فوحان ممكن في السهرات.",
      ratio: "رشتين بيانكو لاتيه + 3 رشات ألترا ميل",
    },
    {
      title: "ثنائي الهيبة والانتعاش النيش",
      titleEn: "Dark Oud & Sparkling Citrus",
      slug1: "black-afgano-nasomatto",
      name1: "بلاك أفغانو (عود وتبغ وبخور)",
      img1: "/images/perfumes/black-afgano-nasomatto.avif",
      slug2: "imagination-louis-vuitton",
      name2: "إيماجينيشن (حمضيات وشاي أسود)",
      img2: "/images/perfumes/imagination-louis-vuitton.avif",
      description: "توازن عبقري بين فخامة وعمق العود والبخور من بلاك أفغانو مع الانتعاش الصيفي الفوار لشاي وزنجبيل إيماجينيشن.",
      ratio: "رشة واحدة بلاك أفغانو + 3 رشات إيماجينيشن",
    },
  ];

  const handleAddDuo = (d: typeof layeringDuos[0]) => {
    const p1 = getProductBySlug(d.slug1);
    const p2 = getProductBySlug(d.slug2);

    if (p1) addSinglePerfume(p1, "110ml");
    if (p2) addSinglePerfume(p2, "110ml");

    toast.success(`تمت إضافة ثنائي ${d.title} (110 مل) إلى السلة!`);
  };

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
          فن دمج وتركيب العطور (Scent Layering)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          ابتكر بصمتك العطرية الخاصة عبر دمج عطرين متناغمين من كافيل للحصول على فوحان فريد لا يتكرر.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {layeringDuos.map((duo, idx) => (
          <div key={idx} className="luxury-card p-6 bg-white border border-slate-200 flex flex-col justify-between space-y-4">
            
            {/* Top Duo Visual */}
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[#fdfbf7] border border-[#ba997a]/20">
              <div className="text-center space-y-1">
                <div className="relative w-20 h-20 mx-auto bg-white rounded-xl p-1 border border-slate-200 overflow-hidden shadow-xs">
                  <Image src={duo.img1} alt={duo.name1} fill className="object-contain p-1" sizes="80px" />
                </div>
                <span className="text-[10px] font-bold text-slate-900 block line-clamp-1">{duo.name1}</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#3f2911] text-[#ba997a] flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs">
                +
              </div>

              <div className="text-center space-y-1">
                <div className="relative w-20 h-20 mx-auto bg-white rounded-xl p-1 border border-slate-200 overflow-hidden shadow-xs">
                  <Image src={duo.img2} alt={duo.name2} fill className="object-contain p-1" sizes="80px" />
                </div>
                <span className="text-[10px] font-bold text-slate-900 block line-clamp-1">{duo.name2}</span>
              </div>
            </div>

            {/* Description & Recipe */}
            <div className="space-y-2 text-right">
              <h3 className="text-base font-extrabold text-[#3f2911]">{duo.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{duo.description}</p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ba997a] shrink-0" />
                <span>طريقة الرش المثالية: {duo.ratio}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">حجم 110 مل لكل عطر</span>
              <button
                type="button"
                onClick={() => handleAddDuo(duo)}
                className="px-4 py-2.5 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#ba997a]" />
                <span>إضافة الثنائي للسلة</span>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
