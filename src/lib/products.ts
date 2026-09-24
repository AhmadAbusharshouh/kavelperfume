import rawProductsData from "@/data/products-lite.json";
import rawPyramidData from "@/data/pyramidMap.json";
import { getPerfumeSurcharge } from "./expensivePerfumes";

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  image: string;
  categories: string[];
  categoriesEn: string[];
  price_110: string;
  price_55: string;
  priceBefore?: string;
  inStock: boolean;
  surcharge55: number;
  surcharge110: number;
  effectivePrice55: number;
  effectivePrice110: number;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  inspiredBy?: string;
}

const productsMap = new Map<string, Product>();
const productsList: Product[] = [];

// Initialize & Normalize Products
const rawProducts = (rawProductsData as { products: Array<Record<string, unknown>> }).products || [];
const pyramidMap = (rawPyramidData as Record<string, { top?: string[]; heart?: string[]; base?: string[]; inspiredBy?: string }>) || {};

for (const raw of rawProducts) {
  const name = String(raw.name || "");
  const nameEn = String(raw.nameEn || "");
  const slug = String(raw.slug || "");
  const id = String(raw.id || slug);

  // Surcharges
  const surcharge55 = getPerfumeSurcharge(name, "55");
  const surcharge110 = getPerfumeSurcharge(name, "110");
  const base55 = parseFloat(String(raw.price_55 || "11")) || 11;
  const base110 = parseFloat(String(raw.price_110 || "16")) || 16;

  // Pyramid notes if available
  const notes = pyramidMap[slug] || pyramidMap[name] || {};

  // Image fallback: clean /productImages/ and /images/perfumes/
  let image = String(raw.image || "");
  if (!image) {
    image = `/images/perfumes/${slug}.avif`;
  } else if (!image.startsWith("http") && !image.startsWith("/")) {
    image = "/" + image;
  }

  const p: Product = {
    id,
    slug,
    name,
    nameEn,
    image,
    categories: Array.isArray(raw.categories) ? (raw.categories as string[]) : [],
    categoriesEn: Array.isArray(raw.categoriesEn) ? (raw.categoriesEn as string[]) : [],
    price_110: String(base110),
    price_55: String(base55),
    priceBefore: String(raw.priceBefore || "32"),
    inStock: raw.inStock !== false,
    surcharge55,
    surcharge110,
    effectivePrice55: base55 + surcharge55,
    effectivePrice110: base110 + surcharge110,
    topNotes: notes.top,
    heartNotes: notes.heart,
    baseNotes: notes.base,
    inspiredBy: notes.inspiredBy,
  };

  productsList.push(p);
  productsMap.set(slug, p);
  productsMap.set(id, p);
  productsMap.set(name.toLowerCase(), p);
}

export function getAllProducts(): Product[] {
  return productsList;
}

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return productsMap.get(decoded) || productsList.find((p) => p.slug === decoded || p.id === decoded);
}

export function getFeaturedProducts(limit = 12): Product[] {
  const bestSellerKeywords = [
    "سوفاج",
    "شانيل",
    "ألترا ميل",
    "إيماجينيشن",
    "سترونجر",
    "بلاك أفغانو",
    "كريد",
    "ليتون",
    "جاز كلوب",
    "توم فورد",
    "بيانكو",
    "جود أوف فاير",
  ];

  const featured = productsList.filter((p) =>
    bestSellerKeywords.some((k) => p.name.includes(k) || p.nameEn.toLowerCase().includes(k.toLowerCase()))
  );

  return featured.length >= limit ? featured.slice(0, limit) : productsList.slice(0, limit);
}

export function searchProducts(query: string, categoryFilter?: string): Product[] {
  let result = productsList;

  if (categoryFilter && categoryFilter !== "all" && categoryFilter !== "الكل") {
    result = result.filter(
      (p) =>
        p.categories.includes(categoryFilter) ||
        p.categoriesEn.some((c) => c.toLowerCase() === categoryFilter.toLowerCase())
    );
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );
  }

  return result;
}
