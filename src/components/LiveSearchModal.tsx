"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, ArrowLeft } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 sm:pt-20 overflow-y-auto">
          {/* Hardware-accelerated GPU Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 bg-slate-950/60 cursor-pointer"
            onClick={onClose}
          />

          {/* 60fps/120fps Modal Card */}
          <motion.div
            initial={{ opacity: 0, transform: "scale3d(0.96, 0.96, 1) translate3d(0, -15px, 0)" }}
            animate={{ opacity: 1, transform: "scale3d(1, 1, 1) translate3d(0, 0, 0)" }}
            exit={{ opacity: 0, transform: "scale3d(0.96, 0.96, 1) translate3d(0, -15px, 0)" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative z-10 bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/90">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="ابحث بالاسم العربي أو الإنجليزي (سوفاج، كريد، Imagination)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-base sm:text-sm font-semibold outline-none text-right"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1"
                >
                  مسح
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-transform active:scale-90 cursor-pointer"
                aria-label="إغلاق البحث"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-slate-100 overscroll-contain">
              <div className="text-[11px] font-bold text-slate-500 pb-1 text-right">
                {query.trim() ? `نتائج البحث عن "${query}" (${results.length})` : "العطور الأكثر بحثاً وشهرة:"}
              </div>

              {results.map((p) => (
                <div
                  key={p.id}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <Link
                    href={`/perfume/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 text-right min-w-0"
                  >
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 p-1 shrink-0 overflow-hidden">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 line-clamp-1" dir="ltr">{p.nameEn}</span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#3f2911]">
                      {p.effectivePrice110} د.أ <span className="text-[10px] font-normal text-slate-400">(110 مل)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        addSinglePerfume(p, "110ml");
                        toast.success(`تمت إضافة ${p.name} إلى السلة`);
                      }}
                      className="p-2 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs transition-transform active:scale-90 cursor-pointer"
                      aria-label="إضافة للسلة"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#ba997a]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                href="/catalog"
                onClick={onClose}
                className="text-xs font-bold text-[#ba997a] hover:text-[#3f2911] transition inline-flex items-center gap-1 active:scale-98"
              >
                <span>عرض كافة العطور في الكتالوج (100+ عطر)</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
