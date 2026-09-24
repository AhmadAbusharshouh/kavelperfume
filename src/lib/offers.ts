export interface BundleOffer {
  id: string;
  title: string;
  titleEn: string;
  size: "55" | "110" | "combo";
  count: number;
  priceJod: number;
  gift: string;
  giftEn: string;
  freeShipping: boolean;
  badge?: string;
  popular?: boolean;
}

export const DEFAULT_OFFERS: BundleOffer[] = [
  {
    id: "bundle-3-55",
    title: "باقة 3 عطور (55 مل)",
    titleEn: "3 Perfumes Bundle (55ml)",
    size: "55",
    count: 3,
    priceJod: 22,
    gift: "تستر مجاني + شحن مخفض",
    giftEn: "Free tester + discounted shipping",
    freeShipping: false,
    badge: "توفير رائع"
  },
  {
    id: "bundle-3-110",
    title: "باقة 3 عطور (110 مل) الأكثر طلباً",
    titleEn: "3 Perfumes Bundle (110ml) Best Seller",
    size: "110",
    count: 3,
    priceJod: 32,
    gift: "تستر مجاني + توصيل مجاني",
    giftEn: "Free tester + Free Delivery",
    freeShipping: true,
    popular: true,
    badge: "الأكثر مبيعاً"
  },
  {
    id: "bundle-4-combo",
    title: "باقة 4 عطور مشكلة (2 عطر 110 مل + 2 عطر 55 مل)",
    titleEn: "4 Perfumes Combo (2x 110ml + 2x 55ml)",
    size: "combo",
    count: 4,
    priceJod: 32,
    gift: "تستر مجاني + توصيل مجاني",
    giftEn: "Free tester + Free Delivery",
    freeShipping: true,
    badge: "باقة مشكلة"
  },
  {
    id: "bundle-4-110",
    title: "باقة 4 عطور (110 مل بالكامل)",
    titleEn: "4 Perfumes Bundle (All 110ml)",
    size: "110",
    count: 4,
    priceJod: 42,
    gift: "2 تستر مجاني + توصيل مجاني",
    giftEn: "2 Free testers + Free Delivery",
    freeShipping: true,
    badge: "قيمة استثنائية"
  },
  {
    id: "bundle-5-55",
    title: "باقة 5 عطور (55 مل)",
    titleEn: "5 Perfumes Bundle (55ml)",
    size: "55",
    count: 5,
    priceJod: 32,
    gift: "2 تستر مجاني + توصيل مجاني",
    giftEn: "2 Free testers + Free Delivery",
    freeShipping: true,
    badge: "باقة العائلة"
  },
  {
    id: "bundle-5-110",
    title: "باقة 5 عطور VIP (110 مل بالكامل)",
    titleEn: "5 VIP Perfumes Bundle (All 110ml)",
    size: "110",
    count: 5,
    priceJod: 48,
    gift: "3 تستر مجاني + توصيل مجاني",
    giftEn: "3 Free testers + Free Delivery",
    freeShipping: true,
    badge: "باقة VIP الفاخرة"
  }
];
