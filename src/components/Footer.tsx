import { Logo } from "./Logo";
import { Phone, MapPin, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 mt-20">
      {/* Top Value Pillars */}
      <div className="border-b border-slate-100 bg-slate-50/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ba997a]/15 text-[#3f2911] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">ثبات وفوحان استثنائي</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">زيوت عطرية نقية بتركيز 30%+</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ba997a]/15 text-[#3f2911] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">توصيل لجميع المحافظات</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">خلال 24 إلى 48 ساعة فقط</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ba997a]/15 text-[#3f2911] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">ضمان ذهبي للاستبدال</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">فحص وتجربة مجانية قبل الاستلام</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ba997a]/15 text-[#3f2911] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#ba997a]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">خدمة عملاء واتساب</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">0782347865 يومياً</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="h-16" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              كافيل بيرفيوم (Kavel Perfume) دار عطور أردنية متخصصة في تقديم أرقى العطور المستوحاة من الماركات العالمية والنيش، بمكونات نقية وتغليف فاخر يليق بذوقكم الرفيع.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-2">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ba997a]" />
                المملكة الأردنية الهاشمية (مستودع أبو نصير)
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/catalog" className="hover:text-[#ba997a] transition">جميع العطور المستوحاة</a></li>
              <li><a href="/#offers" className="hover:text-[#ba997a] transition">عروض وبكجات التوفير</a></li>
              <li><a href="/catalog?cat=رجالي" className="hover:text-[#ba997a] transition">عطور رجالية</a></li>
              <li><a href="/catalog?cat=نسائي" className="hover:text-[#ba997a] transition">عطور نسائية</a></li>
              <li><a href="/catalog?cat=عطور النيش الفاخرة" className="hover:text-[#ba997a] transition">عطور النيش</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Checkout & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900">الطلب المباشر</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              شراء فوري بدون حسابات أو كلمات مرور. الدفع نقداً عند الاستلام لجميع محافظات الأردن.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/962782347865"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>واتساب: 0782347865</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} كافيل بيرفيوم (Kavel Perfume). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span>صُنع بأيدٍ وخبرات أردنية</span>
            <span>•</span>
            <span>شحن سريع عبر لوجستكس</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
