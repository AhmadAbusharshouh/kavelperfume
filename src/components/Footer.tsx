import { Logo } from "./Logo";
import { Phone, MapPin, ShieldCheck, Truck, RefreshCw, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#ba997a]/25 text-slate-700 mt-20">
      {/* Top Value Pillars */}
      <div className="border-b border-slate-100 bg-[#fdfbf7]/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#ba997a]/20 shadow-2xs text-right">
              <div className="w-11 h-11 rounded-xl bg-[#fdfbf7] border border-[#ba997a]/30 text-[#ba997a] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">ثبات وفوحان استثنائي</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">زيوت عطرية نقية بتركيز 30%+</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#ba997a]/20 shadow-2xs text-right">
              <div className="w-11 h-11 rounded-xl bg-[#fdfbf7] border border-[#ba997a]/30 text-[#ba997a] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">توصيل لجميع المحافظات</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">خلال 24 إلى 48 ساعة لباب بيتك</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#ba997a]/20 shadow-2xs text-right">
              <div className="w-11 h-11 rounded-xl bg-[#fdfbf7] border border-[#ba997a]/30 text-[#ba997a] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">ضمان التجربة قبل الدفع</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">فحص وتجربة مجانية قبل الاستلام</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#ba997a]/20 shadow-2xs text-right">
              <div className="w-11 h-11 rounded-xl bg-[#fdfbf7] border border-[#ba997a]/30 text-[#ba997a] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">خدمة عملاء مباشرة</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">واتساب 0782347865 يومياً</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-right">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="h-16" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              <strong className="text-[#3f2911]">كافيل بيرفيوم (Kavel Perfume)</strong> دار عطور أردنية متخصصة في تقديم أرقى العطور المستوحاة من الماركات العالمية والنيش، بمكونات نقية وتغليف فاخر يليق بذوقكم الرفيع.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 pt-2">
              <MapPin className="w-4 h-4 text-[#ba997a] shrink-0" />
              <span>المملكة الأردنية الهاشمية (مستودع الشحن: عمان - أبو نصير)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><Link href="/catalog" className="hover:text-[#ba997a] transition">جميع العطور المستوحاة</Link></li>
              <li><Link href="/#offers" className="hover:text-[#ba997a] transition">عروض وبكجات التوفير</Link></li>
              <li><Link href="/#wizard" className="hover:text-[#ba997a] transition">مستشار العطور الذكي</Link></li>
              <li><Link href="/#packaging" className="hover:text-[#ba997a] transition">تفاصيل التغليف الملكي</Link></li>
              <li><Link href="/cart" className="hover:text-[#ba997a] transition">السلة والشراء الفوري</Link></li>
            </ul>
          </div>

          {/* Col 3: Direct Checkout & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900">الطلب الفوري</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              شراء فوري بدون حسابات أو كلمات مرور. الدفع نقداً عند الاستلام لجميع محافظات الأردن.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/962782347865"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-black border border-emerald-200 transition shadow-2xs active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>واتساب: 078 234 7865</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} كافيل بيرفيوم (Kavel Perfume). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">صُنع بأيدٍ وخبرات أردنية</span>
            <span>•</span>
            <span>شحن سريع ومضمون عبر لوجستكس</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
