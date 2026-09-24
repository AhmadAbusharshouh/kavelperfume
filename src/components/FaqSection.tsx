"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "ما هو ضمان الثبات والفوحان لعطور كافيل؟",
      a: "نعتمد في كافيل نسبة زيوت نقية تتجاوز 30% مع كحول عطري نقي مخصص لصناعة العطور الفاخرة، مما يضمن ثباتاً يتجاوز 24 ساعة على الملابس وفوحاناً واضحاً يمتد لـ 8 إلى 12 ساعة.",
    },
    {
      q: "هل أستطيع تجربة وفحص العطر قبل الدفع لمندوب التوصيل؟",
      a: "نعم بكل تأكيد! يحق لك فحص الطلب والتأكد من التغليف والعطور أمام مندوب التوصيل قبل دفع المبلغ نقداً.",
    },
    {
      q: "كم تستغرق مدة التوصيل وكم تبلغ رسوم الشحن؟",
      a: "يتم توصيل الطلبات خلال 24 إلى 48 ساعة فقط لجميع المحافظات الـ 12 في الأردن عبر شركة لوجستكس من مستودعنا في أبو نصير. رسوم التوصيل 2 د.أ فقط، وتكون مجانية بالكامل عند طلب البكجات أو الطلبات من 32 د.أ فما فوق.",
    },
    {
      q: "ما الفرق بين حجم 55 مل وحجم 110 مل؟",
      a: "كلا الحجمين يحتويان على نفس التركيز العطري الفاخر (30%+). حجم 110 مل هو الأكثر توفيراً ويحتوي على أكثر من 1,100 رشة، بينما حجم 55 مل مصمم ليكون عملياً للحقيبة اليومية والسفر.",
    },
    {
      q: "كيف أستطيع متابعة وتتبع حالة طلبي؟",
      a: "بمجرد تأكيد طلبك، ستصلك رسالة فورية عبر الواتساب برقم الطلب. وعند خروج الشحنة مع المندوب، ستصلك رسالة ثانية تحتوي على رقم التتبع المباشر من لوجستكس.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3f2911]">
          الأسئلة الشائعة والضمان
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          كل ما تحتاج معرفته حول الشحن، جودة التركيبات، والضمان الذهبي لكافيل.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`luxury-card p-4 sm:p-5 bg-white border transition-all cursor-pointer select-none ${
                isOpen ? "border-[#ba997a] shadow-xs" : "border-slate-200"
              }`}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4 text-right">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {faq.q}
                </h3>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className={`w-4 h-4 ${isOpen ? "text-[#ba997a]" : "text-slate-400"}`} />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100 text-right">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
