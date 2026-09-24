"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Product } from "@/lib/products";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<"110ml" | "55ml">("110ml");
  const [added, setAdded] = useState(false);
  const addSinglePerfume = useCartStore((state) => state.addSinglePerfume);

  const is110 = selectedSize === "110ml";
  const currentPrice = is110 ? product.effectivePrice110 : product.effectivePrice55;
  const surcharge = is110 ? product.surcharge110 : product.surcharge55;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addSinglePerfume(product, selectedSize);
    setAdded(true);
    toast.success(`تمت إضافة ${product.name} (${selectedSize}) إلى السلة`);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group luxury-card relative flex flex-col justify-between overflow-hidden bg-white border border-slate-200 rounded-2xl p-4 transition-all duration-300 hover:border-[#ba997a] hover:shadow-lg">
      <Link href={`/perfume/${product.slug}`} className="block">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {product.categories[0] && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {product.categories[0]}
            </span>
          )}
          {surcharge > 0 ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              صنف فاخر (+{surcharge} د.أ)
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ba997a]/15 text-[#3f2911]">
              سعر قياسي
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-xl bg-slate-50/80 p-3 mb-3 overflow-hidden flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-108"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {/* Product Titles */}
        <div className="mb-3">
          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#ba997a] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5" dir="ltr">
            {product.nameEn}
          </p>
        </div>
      </Link>

      {/* Bottom Controls: Size Switch & Quick Add */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
        
        {/* Size Selector Switch */}
        <div className="flex items-center justify-between gap-1 p-1 bg-slate-100/80 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedSize("110ml");
            }}
            className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer active:scale-95 ${
              is110 ? "bg-white text-[#3f2911] shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            110 مل
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedSize("55ml");
            }}
            className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer active:scale-95 ${
              !is110 ? "bg-white text-[#3f2911] shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            55 مل
          </button>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-extrabold text-[#3f2911]">
              {currentPrice} <span className="text-[11px] font-bold text-slate-500">د.أ</span>
            </span>
            <span className="block text-[10px] text-slate-400 line-through">
              {is110 ? "32 د.أ" : "22 د.أ"}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#3f2911] text-white hover:bg-[#2a1a0a]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#ba997a]" />
                <span>إضافة للسلة</span>
              </>
            )}
          </motion.button>
        </div>

      </div>
    </div>
  );
}
