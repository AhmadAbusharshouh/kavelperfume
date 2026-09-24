"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

  if (!mounted || !isOpen) return null;

  const count = getItemCount();
  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotalAmount();

  // Free shipping threshold (32 JOD)
  const freeShippingThreshold = 32;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0" onClick={(e) => e.stopPropagation()}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ba997a]" />
              <h2 className="text-sm sm:text-base font-extrabold text-[#3f2911]">
                سلة التسوق ({count} عطور)
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
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
                    className="bg-[#ba997a] h-full rounded-full transition-all duration-500"
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">سلتك فارغة حالياً</p>
                <Link
                  href="/catalog"
                  onClick={onClose}
                  className="inline-block px-4 py-2 bg-[#3f2911] text-white rounded-xl text-xs font-bold"
                >
                  تصفح العطور
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-start justify-between">
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
                        className="text-slate-400 hover:text-rose-600 p-0.5"
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
                          className="w-4 h-4 rounded bg-white text-slate-700 flex items-center justify-center text-[10px] font-bold hover:bg-slate-200"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-4 h-4 rounded bg-white text-slate-700 flex items-center justify-center text-[10px] font-bold hover:bg-slate-200"
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
                className="w-full py-3.5 bg-[#3f2911] hover:bg-[#2a1a0a] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <span>متابعة الشراء الفوري (الدفع عند الاستلام)</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
