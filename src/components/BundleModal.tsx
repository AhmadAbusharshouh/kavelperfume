"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, Gift, Plus, Sparkles, ShoppingBag } from "lucide-react";
import { BundleOffer } from "@/lib/offers";
import { Product, getAllProducts } from "@/lib/products";
import { PerfumeSelection, useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

interface BundleModalProps {
  offer: BundleOffer;
  isOpen: boolean;
  onClose: () => void;
}

export function BundleModal({ offer, isOpen, onClose }: BundleModalProps) {
  const [selectedPerfumes, setSelectedPerfumes] = useState<PerfumeSelection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "men" | "women" | "unisex">("all");
  const addBundleOffer = useCartStore((state) => state.addBundleOffer);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const allProducts = getAllProducts();

  const filtered = allProducts.filter((p) => {
    if (activeTab === "men" && !p.categories.includes("رجالي")) return false;
    if (activeTab === "women" && !p.categories.includes("نسائي")) return false;
    if (activeTab === "unisex" && !p.categories.includes("للجنسين")) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
    }
    return true;
  });

  const slotsNeeded = offer.count;
  const currentSlotsFilled = selectedPerfumes.length;

  const handleSelect = (product: Product) => {
    if (selectedPerfumes.length >= slotsNeeded) {
      toast.error(`لقد اخترت بالفعل ${slotsNeeded} عطور للباقة`);
      return;
    }

    let bottleSize: "110ml" | "55ml" = "110ml";
    if (offer.size === "55") bottleSize = "55ml";
    else if (offer.size === "110") bottleSize = "110ml";
    else if (offer.size === "combo") {
      bottleSize = selectedPerfumes.length < 2 ? "110ml" : "55ml";
    }

    const surcharge = bottleSize === "110ml" ? product.surcharge110 : product.surcharge55;

    const newSel: PerfumeSelection = {
      id: `${product.id}_${Date.now()}_${Math.random()}`,
      name: product.name,
      nameEn: product.nameEn,
      size: bottleSize,
      surcharge,
    };

    setSelectedPerfumes([...selectedPerfumes, newSel]);
    toast.success(`تمت إضافة ${product.name} إلى باقتك`);
  };

  const handleRemoveSlot = (index: number) => {
    const updated = [...selectedPerfumes];
    updated.splice(index, 1);
    setSelectedPerfumes(updated);
  };

  const totalSurcharges = selectedPerfumes.reduce((sum, s) => sum + (s.surcharge || 0), 0);
  const finalPrice = offer.priceJod + totalSurcharges;

  const handleAddToCart = () => {
    if (selectedPerfumes.length < slotsNeeded) {
      toast.error(`يرجى اختيار ${slotsNeeded - selectedPerfumes.length} عطور إضافية لاكتمال الباقة`);
      return;
    }
    addBundleOffer(offer, selectedPerfumes);
    toast.success(`تمت إضافة ${offer.title} إلى السلة بنجاح`);
    onClose();
    setTimeout(() => {
      setDrawerOpen(true);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, transform: "scale3d(0.96, 0.96, 1) translate3d(0, 10px, 0)" }}
            animate={{ opacity: 1, transform: "scale3d(1, 1, 1) translate3d(0, 0, 0)" }}
            exit={{ opacity: 0, transform: "scale3d(0.96, 0.96, 1) translate3d(0, 10px, 0)" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 bg-white border border-[#ba997a]/35 rounded-3xl w-full max-w-3xl max-h-[90dvh] flex flex-col shadow-2xl overflow-hidden text-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-white to-[#fdfbf7]">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#ba997a] mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تخصيص الباقة</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#3f2911]">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  اختر {offer.count} عطور من التشكيلة الكاملة (المتبقي: {slotsNeeded - currentSlotsFilled})
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all active:scale-90 cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Perfume Slots Bar */}
            <div className="p-3 sm:p-4 bg-[#fdfbf7] border-b border-[#ba997a]/25">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800">
                  العطور المختارة في باقتك ({currentSlotsFilled}/{slotsNeeded}):
                </span>
                <span className="text-[11px] font-bold text-emerald-800">
                  {currentSlotsFilled === slotsNeeded ? "✓ اكتملت الباقة!" : `اختر ${slotsNeeded - currentSlotsFilled} عطور أخرى`}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Array.from({ length: slotsNeeded }).map((_, idx) => {
                  const selected = selectedPerfumes[idx];
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-2xl border text-center relative flex flex-col justify-between min-h-[75px] transition-all ${
                        selected
                          ? "bg-white border-[#ba997a] shadow-xs ring-2 ring-[#ba997a]/20"
                          : "border-dashed border-slate-300 bg-white/70 text-slate-400"
                      }`}
                    >
                      {selected ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(idx)}
                            className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer active:scale-90 shadow-2xs"
                            title="إزالة هذا العطر"
                          >
                            ✕
                          </button>
                          <span className="text-[11px] font-black text-slate-900 line-clamp-1">
                            {selected.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold block mt-1">
                            {selected.size} {selected.surcharge > 0 ? `(+${selected.surcharge} د.أ)` : ""}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <Plus className="w-4 h-4 mb-0.5 text-[#ba997a]" />
                          <span className="text-[11px] font-bold">عطر {idx + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-wrap gap-2 items-center justify-between bg-white">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم العربي أو الإنجليزي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#ba997a]"
                />
              </div>

              <div className="flex gap-1">
                {(["all", "men", "women", "unisex"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer ${
                      activeTab === tab
                        ? "bg-[#3f2911] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab === "all" ? "الكل" : tab === "men" ? "رجالي" : tab === "women" ? "نسائي" : "للجنسين"}
                  </button>
                ))}
              </div>
            </div>

            {/* Perfumes Selector Grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 overscroll-contain bg-slate-50/40">
              {filtered.map((p) => {
                const countSelected = selectedPerfumes.filter((s) => s.name === p.name).length;
                const surcharge = offer.size === "55" ? p.surcharge55 : p.surcharge110;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelect(p)}
                    className={`p-2.5 rounded-2xl border text-right transition-all active:scale-98 cursor-pointer flex flex-col justify-between relative group ${
                      countSelected > 0
                        ? "bg-[#fdfbf7] border-[#ba997a] shadow-xs ring-2 ring-[#ba997a]/20"
                        : "bg-white border-slate-200 hover:border-[#ba997a]/60 shadow-2xs"
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-xl bg-slate-50 mb-2 p-1 border border-slate-100">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="120px" />
                      {countSelected > 0 && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs font-black text-[10px]">
                          {countSelected}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1" dir="ltr">{p.nameEn}</p>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-black text-[#3f2911]">
                        {surcharge > 0 ? `+${surcharge} د.أ` : "مشمول"}
                      </span>
                      <span className="text-[10px] text-[#ba997a] font-black bg-[#ba997a]/15 px-2 py-0.5 rounded-md group-hover:bg-[#3f2911] group-hover:text-white transition-colors">
                        + اختيار
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">إجمالي الباقة:</span>
                  <span className="text-xl font-black text-[#3f2911]">
                    {finalPrice} <span className="text-xs font-bold text-slate-500">د.أ</span>
                  </span>
                </div>
                {offer.gift && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800">
                    <Gift className="w-3.5 h-3.5 text-emerald-600" />
                    {offer.gift} + توصيل مجاني
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-600 hover:bg-slate-50 cursor-pointer active:scale-95"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={selectedPerfumes.length < slotsNeeded}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black text-white transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 ${
                    selectedPerfumes.length === slotsNeeded
                      ? "bg-[#3f2911] hover:bg-[#2a1a0a] shadow-md border border-[#ba997a]/40"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#ba997a]" />
                  <span>إضافة الباقة للسلة ({currentSlotsFilled}/{slotsNeeded})</span>
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
