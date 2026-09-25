"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Gift, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatPerfumeCount(n: number): string {
  if (n === 0) return "فارغة";
  if (n === 1) return "عطر واحد";
  if (n === 2) return "عطران";
  if (n >= 3 && n <= 10) return `${n} عطور`;
  return `${n} عطراً`;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getSubtotal, getShippingFee, getTotalAmount, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  const count = getItemCount();
  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotalAmount();

  const freeShippingThreshold = 32;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden text-right">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pointer-events-none">
            {/* Drawer Container */}
            <motion.div
              initial={{ transform: "translate3d(-100%, 0, 0)" }}
              animate={{ transform: "translate3d(0%, 0, 0)" }}
              exit={{ transform: "translate3d(-100%, 0, 0)" }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
              style={{ willChange: "transform" }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between pointer-events-auto border-r border-[#ba997a]/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-white to-[#fdfbf7]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#ba997a]/15 text-[#3f2911] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-[#ba997a]" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-[#3f2911]">
                      سلة المشتريات
                    </h2>
                    <span className="text-[11px] text-slate-500 font-bold">
                      {formatPerfumeCount(count)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all active:scale-90 cursor-pointer"
                  aria-label="إغلاق السلة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="p-3.5 bg-[#fdfbf7] border-b border-[#ba997a]/20 text-xs">
                {remainingForFreeShipping > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>أضف بقيمة <strong className="text-[#3f2911]">{remainingForFreeShipping} د.أ</strong> للشحن المجاني</span>
                      <Truck className="w-3.5 h-3.5 text-[#ba997a]" />
                    </div>
                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#ba997a] h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-[11px] bg-emerald-50/80 p-2 rounded-xl border border-emerald-200/60">
                    <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تهانينا! طلبيتك مؤهلة للتوصيل المجاني + تستر هدية</span>
                  </div>
                )}
              </div>

              {/* Items Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 overscroll-contain bg-slate-50/30">
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-[#fdfbf7] border border-[#ba997a]/30 flex items-center justify-center mx-auto text-[#ba997a]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-black text-[#3f2911]">سلتك فارغة حالياً</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">تصفح باقات التوفير أو الكتالوج الكامل لاختيار عطورك المميزة.</p>
                    <Link
                      href="/catalog"
                      onClick={onClose}
                      className="inline-block px-5 py-2.5 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs font-black transition-all active:scale-95 shadow-xs border border-[#ba997a]/30"
                    >
                      تصفح جميع العطور
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="pt-3 first:pt-0 flex gap-3 items-start justify-between"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shrink-0 overflow-hidden p-1 flex items-center justify-center shadow-2xs">
                        <Image
                          src={item.image || "/images/perfumes/bleu-de-chanel.avif"}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{item.title}</h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                            aria-label="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.size}
                          </span>
                          {item.surchargeTotal > 0 && (
                            <span className="text-amber-800 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                              +{item.surchargeTotal} د.أ فاخر
                            </span>
                          )}
                        </div>

                        {/* Bundle selections breakdown */}
                        {item.selections && item.selections.length > 0 && (
                          <div className="p-2 bg-white rounded-xl border border-slate-200/70 text-[10px] text-slate-600 space-y-0.5 mt-1">
                            <span className="font-black block text-[#3f2911]">العطور المختارة:</span>
                            {item.selections.map((s, idx) => (
                              <div key={idx} className="flex justify-between text-slate-700">
                                <span>• {s.name} ({s.size})</span>
                                {s.surcharge > 0 && <span className="font-bold text-amber-800">+{s.surcharge} د.أ</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 bg-slate-100/90 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center text-[10px] font-black hover:bg-slate-200 transition active:scale-90 cursor-pointer shadow-2xs"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-black px-1.5">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center text-[10px] font-black hover:bg-slate-200 transition active:scale-90 cursor-pointer shadow-2xs"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <span className="text-xs sm:text-sm font-black text-[#3f2911]">
                            {item.totalPrice} د.أ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Checkout CTA */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 shadow-xl">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span className="font-black text-slate-900">{subtotal} د.أ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التوصيل:</span>
                      {shipping === 0 ? (
                        <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">مجاني</span>
                      ) : (
                        <span className="font-bold text-slate-900">{shipping} د.أ</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#3f2911] pt-2 border-t border-slate-100">
                      <span>المجموع الإجمالي عند الاستلام:</span>
                      <span className="text-base font-black">{total} د.أ</span>
                    </div>
                  </div>

                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full py-3.5 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 border border-[#ba997a]/40"
                  >
                    <span>متابعة الشراء الفوري (الدفع عند الاستلام)</span>
                    <ArrowLeft className="w-4 h-4 text-[#ba997a]" />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ضمان المعاينة والتجربة قبل الدفع لمندوب التوصيل</span>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
