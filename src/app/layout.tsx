import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TopLoader } from "@/components/TopLoader";
import { ToastProvider } from "@/components/ToastProvider";
import { GlobalCartDrawer } from "@/components/GlobalCartDrawer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-alexandria",
});

export const metadata: Metadata = {
  title: "كافيل بيرفيوم / عطور مستوحاة بثبات استثنائي بأيدٍ أردنية | Kavel Perfume",
  description: "دار العطور الأردنية الرائدة في تركيب أجود العطور العالمية والنيش المستوحاة بتركيز فائق وزيوت نقية. شحن سريع لكافة محافظات الأردن.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={alexandria.variable}>
      <body className={`min-h-screen bg-[#FAFAF9] text-[#0F172A] antialiased flex flex-col justify-between selection:bg-[#ba997a]/30 selection:text-[#3f2911] ${alexandria.className}`}>
        <TopLoader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GlobalCartDrawer />
        <FloatingWhatsApp />
        <ToastProvider />
      </body>
    </html>
  );
}
