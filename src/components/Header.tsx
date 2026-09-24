"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Phone, Search } from "lucide-react";
import { Logo } from "./Logo";
import { useCartStore } from "@/lib/cartStore";
import { LiveSearchModal } from "./LiveSearchModal";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "جميع العطور", href: "/catalog" },
    { label: "العروض والبكجات", href: "/#offers" },
    { label: "تغليف كافيل", href: "/#packaging" },
    { label: "مكتشف العطور", href: "/#wizard" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            
            {/* Left: Desktop Navigation (Hidden on mobile) */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-6 flex-1 justify-start">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs lg:text-sm font-bold text-slate-700 hover:text-[#ba997a] transition-all py-2 hover:scale-102 active:scale-98"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Center: 100% Dead-Center Logo (Responsive height: h-14 on mobile, h-20 on desktop) */}
            <div className="flex items-center justify-center shrink-0 mx-auto">
              <Logo className="h-14 sm:h-20" />
            </div>

            {/* Right: Actions (Search, WhatsApp, Cart, Mobile Toggle) */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-slate-700 hover:text-[#ba997a] transition-all rounded-xl hover:bg-slate-100 flex items-center justify-center cursor-pointer active:scale-95 min-w-[40px] min-h-[40px]"
                aria-label="بحث سريع في العطور"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href="https://wa.me/962782347865"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>0782347865</span>
              </a>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="relative p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-[#3f2911] text-white hover:bg-[#2a1a0a] transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 min-h-[40px]"
                aria-label="فتح سلة التسوق"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#ba997a]" />
                <span className="text-xs font-bold hidden sm:inline">السلة</span>
                {mounted && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-[#ba997a] text-[#3f2911] text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all active:scale-95 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="فتح القائمة"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer with AnimatePresence */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl overflow-hidden"
            >
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-[#ba997a] transition active:scale-98 min-h-[44px] flex items-center"
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setDrawerOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#3f2911] text-white rounded-xl text-xs font-bold active:scale-98 transition shadow-xs min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#ba997a]" />
                  <span>عرض السلة والشراء ({itemCount} عطور)</span>
                </button>

                <a
                  href="https://wa.me/962782347865"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 active:scale-98 transition min-h-[44px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>طلب مباشر عبر واتساب (0782347865)</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Live Search Modal */}
      <LiveSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
