export interface PremiumPerfumeIncrement {
  name: string;
  nameEn?: string;
  inc55: number;
  inc110: number;
  gradeOptions?: boolean;
}

export const DEFAULT_PREMIUM_PERFUMES: PremiumPerfumeIncrement[] = [
  { name: "Black Afgano / بلاك أفغانو", nameEn: "Black Afgano", inc55: 5, inc110: 8, gradeOptions: false },
  { name: "G*D OF FIRE / جود أوف فاير", nameEn: "God of Fire", inc55: 4, inc110: 6, gradeOptions: false },
  { name: "Imagination (Louis Vuitton) / إيماجينيشن", nameEn: "Imagination", inc55: 4, inc110: 6, gradeOptions: true },
  { name: "Stronger With You Intensely / سترونجر ويذ يو إنتنسلي", nameEn: "Stronger With You Intensely", inc55: 3, inc110: 4, gradeOptions: true },
  { name: "Layton (Parfums de Marly) / ليتون", nameEn: "Layton", inc55: 2, inc110: 3, gradeOptions: false },
  { name: "King Enable (Assaf) / كينغ إنيبل", nameEn: "King Enable", inc55: 2, inc110: 3, gradeOptions: false },
  { name: "Oud Maracuja / عود موراكوجا", nameEn: "Oud Maracuja", inc55: 1, inc110: 2, gradeOptions: false },
  { name: "Stronger With You Sandalwood / سترونجر ساندلوود", nameEn: "Stronger With You Sandalwood", inc55: 1, inc110: 2, gradeOptions: false },
  { name: "Stronger With You Absolutely / سترونجر أبسلوتلي", nameEn: "Stronger With You Absolutely", inc55: 1, inc110: 2, gradeOptions: false },
  { name: "Interlude Man (Amouage) / إنترلود أمواج", nameEn: "Interlude Man", inc55: 1, inc110: 2, gradeOptions: false },
  { name: "Le Beau Le Parfum (JPG) / لو بو لو بارفيوم", nameEn: "Le Beau Le Parfum", inc55: 1, inc110: 2, gradeOptions: false },
  { name: "Creed Aventus / كريد أفينتوس", nameEn: "Creed Aventus", inc55: 1, inc110: 2, gradeOptions: true },
  { name: "Dior Sauvage / ديور سوفاج", nameEn: "Dior Sauvage", inc55: 1, inc110: 2, gradeOptions: true },
  { name: "Bleu de Chanel / بلو دي شانيل", nameEn: "Bleu de Chanel", inc55: 1, inc110: 2, gradeOptions: true },
  { name: "Dior Sauvage Elixir / ديور سوفاج إلكسير", nameEn: "Dior Sauvage Elixir", inc55: 1, inc110: 2, gradeOptions: true },
  { name: "Jazz Club (Maison Margiela) / جاز كلوب", nameEn: "Jazz Club", inc55: 12, inc110: 18, gradeOptions: false }
];

export function normalizePerfumeLookup(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/[/\\\-_()\s]+/g, " ")
    .trim();
}

export function getPerfumeSurcharge(
  name: string,
  size: "55" | "110" | "55ml" | "110ml",
  customList: PremiumPerfumeIncrement[] = DEFAULT_PREMIUM_PERFUMES
): number {
  if (!name) return 0;
  const clean = normalizePerfumeLookup(name);
  const sizeKey = size.includes("110") ? "inc110" : "inc55";

  for (const item of customList) {
    const itemNameNorm = normalizePerfumeLookup(item.name);
    const itemEnNorm = normalizePerfumeLookup(item.nameEn || "");

    if (
      clean.includes(itemNameNorm) ||
      itemNameNorm.includes(clean) ||
      (itemEnNorm && (clean.includes(itemEnNorm) || itemEnNorm.includes(clean)))
    ) {
      return item[sizeKey] || 0;
    }
  }

  return 0;
}
