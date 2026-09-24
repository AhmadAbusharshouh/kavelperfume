"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedNote, setSelectedNote] = useState("all");

  const products = useMemo(() => getAllProducts(), []);

  const noteCategories = [
    "فانيليا",
    "عود وبخور",
    "توابل وحار",
    "أروماتك",
    "خشبي",
    "عنبر",
    "جلدي",
    "توباكو وتبغ",
    "حمضيات ومنعش",
    "فاكهي",
    "حلو / سويت",
    "عطور النيش الفاخرة",
  ];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        const matchCat = p.categories.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchCat) return false;
      }

      // Gender
      if (selectedGender !== "all") {
        if (!p.categories.includes(selectedGender)) return false;
      }

      // Season
      if (selectedSeason !== "all") {
        if (!p.categories.includes(selectedSeason)) return false;
      }

      // Note
      if (selectedNote !== "all") {
        const matchNote = p.categories.some((c) =>
          c.includes(selectedNote) || selectedNote.includes(c)
        );
        if (!matchNote) return false;
      }

      return true;
    });
  }, [products, search, selectedGender, selectedSeason, selectedNote]);

  const hasActiveFilters =
    selectedGender !== "all" || selectedSeason !== "all" || selectedNote !== "all" || search !== "";

  const clearFilters = () => {
    setSearch("");
    setSelectedGender("all");
    setSelectedSeason("all");
    setSelectedNote("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Page Heading */}
      <div className="text-right">
        <h1 className="text-xl sm:text-3xl font-extrabold text-[#3f2911]">
          كتالوج عطور كافيل الفاخرة
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          اكتشف أكثر من 100 عطر مستوحى بتركيز فائق وثبات يدوم طويلاً (حجم 110 مل و 55 مل).
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="luxury-card p-4 sm:p-6 bg-white border border-slate-200 space-y-4">
        
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="ابحث بالاسم العربي أو الإنجليزي (سوفاج، كريد، Imagination)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium outline-none focus:bg-white focus:border-[#ba997a]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          {/* Gender Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">النوع / الجنس</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold outline-none focus:bg-white focus:border-[#ba997a]"
            >
              <option value="all">جميع الأنواع</option>
              <option value="رجالي">رجالي</option>
              <option value="نسائي">نسائي</option>
              <option value="للجنسين">للجنسين</option>
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">الموسم والفصل</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold outline-none focus:bg-white focus:border-[#ba997a]"
            >
              <option value="all">جميع المواسم</option>
              <option value="شتوي">شتوي</option>
              <option value="صيفي">صيفي</option>
              <option value="ربيعي">ربيعي</option>
              <option value="خريفي">خريفي</option>
              <option value="جميع الفصول">جميع الفصول</option>
            </select>
          </div>

          {/* Note Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">المكون / الخط العطري</label>
            <select
              value={selectedNote}
              onChange={(e) => setSelectedNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs font-semibold outline-none focus:bg-white focus:border-[#ba997a]"
            >
              <option value="all">جميع المكونات</option>
              {noteCategories.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filter Chips & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#ba997a]" />
            <span>عرض <strong>{filtered.length}</strong> عطر متوفر</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-rose-600 font-bold hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>إلغاء جميع الفلاتر</span>
            </button>
          )}
        </div>

      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="luxury-card p-12 text-center bg-white border border-slate-200 space-y-3">
          <p className="text-sm font-bold text-slate-700">لم يتم العثور على عطور تطابق بحثك</p>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-[#3f2911] text-white rounded-xl text-xs font-bold"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}

    </div>
  );
}
