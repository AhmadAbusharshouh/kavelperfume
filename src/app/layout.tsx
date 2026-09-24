import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TopLoader } from "@/components/TopLoader";
import { ToastProvider } from "@/components/ToastProvider";
import { GlobalCartDrawer } from "@/components/GlobalCartDrawer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

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
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAFAF9] text-[#0F172A] antialiased flex flex-col justify-between selection:bg-[#ba997a]/30 selection:text-[#3f2911]">
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
