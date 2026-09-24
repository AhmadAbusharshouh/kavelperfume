import { Phone } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/962782347865?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%83%D8%A7%D9%81%D9%8A%D9%84%20%D8%A8%D9%8A%D8%B1%D9%81%D9%8A%D9%88%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%B9%D8%B7%D9%88%D8%B1"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
      aria-label="تواصل معنا عبر واتساب"
    >
      <Phone className="w-4 h-4" />
      <span className="hidden sm:inline">مساعدة سريعة / 0782347865</span>
    </a>
  );
}
