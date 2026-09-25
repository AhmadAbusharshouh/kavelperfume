"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, ArrowLeft, Sparkles } from "lucide-react";
import { Product, searchProducts } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const [query, setQuery] = useState("");
  const addSinglePerfume = useCartStore((state) => state.addSinglePerfume);
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

  const results: Product[] = query.trim() ? searchProducts(query).slice(0, 8) : searchProducts("سوفاج").slice(0, 6);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 sm:pt-20 overflow-y-auto text-right">
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
            initial={{ opacity: 0, transform: "scale3d(0.96, 0.96, 1) translate3d(0, -15px, 0)" }}
            animate={{ opacity: 1, transform: "scale3d(1, 1, 1) translate3d(0, 0, 0)" }}
            exit={{ opacity: 0, transform: "scale3d(0.96, 0.96, 1) translate3d(0, -15px, 0)" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 bg-white border border-[#ba997a]/35 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-l from-white to-[#fdfbf7]">
              <Search className="w-5 h-5 text-[#ba997a] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="ابحث بالاسم العربي أو الإنجليزي (سوفاج، كريد، Imagination)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm sm:text-base font-bold outline-none text-right text-slate-900 placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer px-2 py-1 bg-slate-100 rounded-lg"
                >
                  مسح
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all active:scale-90 cursor-pointer"
                aria-label="إغلاق البحث"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-slate-100 overscroll-contain bg-slate-50/30">
              <div className="text-[11px] font-black text-slate-500 pb-1">
                {query.trim() ? `نتائج البحث عن "${query}" (${results.length})` : "العطور الأكثر طلباً وشهرة:"}
              </div>

              {results.map((p) => (
                <div
                  key={p.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-white hover:border-[#ba997a]/30 border border-transparent transition-all shadow-2xs"
                >
                  <Link
                    href={`/perfume/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="relative w-12 h-12 rounded-xl bg-white border border-slate-200/80 p-1 shrink-0 overflow-hidden">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1">{p.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 line-clamp-1" dir="ltr">{p.nameEn}</span>
                        {p.categories[0] && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {p.categories[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <div className="text-left">
                      <span className="text-xs font-black text-[#3f2911] block">
                        {p.effectivePrice110} <span className="text-[10px] font-normal">د.أ</span>
                      </span>
                      <span className="text-[9px] text-slate-400">110 مل</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addSinglePerfume(p, "110ml");
                        toast.success(`تمت إضافة ${p.name} إلى السلة`);
                        onClose();
                        setTimeout(() => setDrawerOpen(true), 250);
                      }}
                      className="p-2.5 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs transition-all active:scale-90 cursor-pointer border border-[#ba997a]/30"
                      aria-label="إضافة للسلة"
                      title="إضافة للسلة"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#ba997a]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-white border-t border-slate-100 text-center">
              <Link
                href="/catalog"
                onClick={onClose}
                className="text-xs font-black text-[#ba997a] hover:text-[#3f2911] transition inline-flex items-center gap-1 active:scale-98"
              >
                <span>تصفح جميع العطور في الكتالوج الكامل (100+ عطر)</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
