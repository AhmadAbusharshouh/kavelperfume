"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Gift, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Hardware-accelerated GPU Backdrop Fade (Zero blur for 120fps speed) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0 bg-slate-950/60 cursor-pointer"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 pointer-events-none">
            {/* 60fps/120fps GPU Compositor Drawer (translate3d with Apple-standard ease) */}
            <motion.div
              initial={{ transform: "translate3d(-100%, 0, 0)" }}
              animate={{ transform: "translate3d(0%, 0, 0)" }}
              exit={{ transform: "translate3d(-100%, 0, 0)" }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
              style={{ willChange: "transform" }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between pointer-events-auto border-r border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#ba997a]" />
                  <h2 className="text-sm sm:text-base font-extrabold text-[#3f2911]">
                    سلة التسوق ({count} عطور)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-transform active:scale-90 cursor-pointer"
                  aria-label="إغلاق السلة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="p-3 bg-[#fdfbf7] border-b border-[#ba997a]/20 text-xs text-right">
                {remainingForFreeShipping > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>أضف بقيمة <strong>{remainingForFreeShipping} د.أ</strong> للحصول على شحن مجاني</span>
                      <Truck className="w-3.5 h-3.5 text-[#ba997a]" />
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#ba997a] h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-[11px]">
                    <Gift className="w-4 h-4 text-emerald-600" />
                    <span>تهانينا! طلبيتك مؤهلة للتوصيل المجاني + تستر هدية</span>
                  </div>
                )}
              </div>

              {/* Items Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 overscroll-contain">
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">سلتك فارغة حالياً</p>
                    <Link
                      href="/catalog"
                      onClick={onClose}
                      className="inline-block px-4 py-2 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
                    >
                      تصفح العطور
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="pt-3 first:pt-0 flex gap-3 items-start justify-between"
                    >
                      <div className="relative w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden p-1 flex items-center justify-center">
                        <Image
                          src={item.image || "/images/perfumes/bleu-de-chanel.avif"}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-right space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.size}
                          </span>
                          {item.surchargeTotal > 0 && (
                            <span className="text-amber-700 font-bold">
                              (+{item.surchargeTotal} د.أ فاخر)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center text-[10px] font-bold hover:bg-slate-200 transition-transform active:scale-90 cursor-pointer"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center text-[10px] font-bold hover:bg-slate-200 transition-transform active:scale-90 cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <span className="text-xs font-extrabold text-[#3f2911]">
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
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span className="font-bold text-slate-900">{subtotal} د.أ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التوصيل:</span>
                      {shipping === 0 ? (
                        <span className="font-bold text-emerald-700">مجاني</span>
                      ) : (
                        <span className="font-bold text-slate-900">{shipping} د.أ</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-[#3f2911] pt-1.5 border-t border-slate-100">
                      <span>المجموع الإجمالي:</span>
                      <span className="text-base">{total} د.أ</span>
                    </div>
                  </div>

                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full py-3.5 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>متابعة الشراء الفوري (الدفع عند الاستلام)</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
