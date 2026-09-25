import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <aside aria-label="مساعدة سريعة" className="fixed bottom-6 left-6 z-40">
      <a
        href="https://wa.me/962782347865?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%83%D8%A7%D9%81%D9%8A%D9%84%20%D8%A8%D9%8A%D8%B1%D9%81%D9%8A%D9%88%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%B9%D8%B7%D9%88%D8%B1"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-2xl transition-all duration-300 flex items-center gap-2.5 hover:scale-105 active:scale-95 border-2 border-white/80"
        aria-label="تواصل معنا عبر واتساب"
      >
        {/* Subtle Pulse Animation Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />

        <MessageCircle className="w-4 h-4 shrink-0 fill-white" />
        <span className="hidden sm:inline font-black tracking-wide">مساعدة فورية / واتساب</span>
      </a>
    </aside>
  );
}
