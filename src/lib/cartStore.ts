"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getPerfumeSurcharge } from "./expensivePerfumes";
import { DEFAULT_OFFERS, BundleOffer } from "./offers";

export interface PerfumeSelection {
  id: string;
  name: string;
  nameEn?: string;
  size: "55ml" | "110ml";
  surcharge: number;
}

export interface CartItem {
  id: string;
  type: "single" | "bundle";
  productId?: string;
  title: string;
  titleEn?: string;
  size: "55ml" | "110ml" | "combo";
  quantity: number;
  basePrice: number;
  surchargeTotal: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
  selections?: PerfumeSelection[];
  giftNotes?: string;
  freeShipping?: boolean;
}

interface CartStore {
  items: CartItem[];
  basePrice55: number;
  basePrice110: number;
  shippingFee: number;
  isDrawerOpen: boolean;
  
  // Actions
  setDrawerOpen: (open: boolean) => void;
  addSinglePerfume: (product: { id: string; name: string; nameEn?: string; image?: string }, size?: "55ml" | "110ml") => void;
  addBundleOffer: (offer: BundleOffer, selections: PerfumeSelection[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  
  // Dynamic Pricing Overrides
  setPricingConfig: (config: { base55?: number; base110?: number; shipping?: number }) => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      basePrice55: 11,
      basePrice110: 16,
      shippingFee: 2,
      isDrawerOpen: false,

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      addSinglePerfume: (product, size = "110ml") => {
        const { basePrice55, basePrice110, items } = get();
        const basePrice = size === "110ml" ? basePrice110 : basePrice55;
        const surcharge = getPerfumeSurcharge(product.name, size);
        const unitPrice = basePrice + surcharge;

        const existingIndex = items.findIndex(
          (i) => i.type === "single" && i.productId === product.id && i.size === size
        );

        if (existingIndex > -1) {
          const updated = [...items];
          const existing = updated[existingIndex];
          const newQty = existing.quantity + 1;
          updated[existingIndex] = {
            ...existing,
            quantity: newQty,
            totalPrice: newQty * existing.unitPrice,
          };
          set({ items: updated, isDrawerOpen: true });
        } else {
          const newItem: CartItem = {
            id: `single_${product.id}_${size}_${Date.now()}`,
            type: "single",
            productId: product.id,
            title: product.name,
            titleEn: product.nameEn,
            size,
            quantity: 1,
            basePrice,
            surchargeTotal: surcharge,
            unitPrice,
            totalPrice: unitPrice,
            image: product.image || "/images/perfumes/bleu-de-chanel.avif",
          };
          set({ items: [...items, newItem], isDrawerOpen: true });
        }
      },

      addBundleOffer: (offer, selections) => {
        const { items } = get();
        const totalSurcharges = selections.reduce((sum, sel) => sum + (sel.surcharge || 0), 0);
        const unitPrice = offer.priceJod + totalSurcharges;

        const sizeLabel: CartItem["size"] =
          offer.size === "110" ? "110ml" : offer.size === "55" ? "55ml" : "combo";

        const newItem: CartItem = {
          id: `bundle_${offer.id}_${Date.now()}`,
          type: "bundle",
          title: offer.title,
          titleEn: offer.titleEn,
          size: sizeLabel,
          quantity: 1,
          basePrice: offer.priceJod,
          surchargeTotal: totalSurcharges,
          unitPrice,
          totalPrice: unitPrice,
          image: "/images/kavel/08_kavel-luxury-shopping-gift-bag.avif",
          selections,
          giftNotes: offer.gift,
          freeShipping: offer.freeShipping,
        };

        set({ items: [...items, newItem], isDrawerOpen: true });
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, delta) => {
        const { items } = get();
        const updated = items
          .map((item) => {
            if (item.id === itemId) {
              const newQty = item.quantity + delta;
              if (newQty <= 0) return null;
              return {
                ...item,
                quantity: newQty,
                totalPrice: newQty * item.unitPrice,
              };
            }
            return item;
          })
          .filter(Boolean) as CartItem[];
        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setPricingConfig: (config) => {
        set((state) => ({
          basePrice55: config.base55 !== undefined ? config.base55 : state.basePrice55,
          basePrice110: config.base110 !== undefined ? config.base110 : state.basePrice110,
          shippingFee: config.shipping !== undefined ? config.shipping : state.shippingFee,
        }));
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getShippingFee: () => {
        const { items, shippingFee } = get();
        if (items.length === 0) return 0;
        const hasFreeShipping = items.some((i) => i.freeShipping);
        const subtotal = get().getSubtotal();
        if (hasFreeShipping || subtotal >= 32) {
          return 0;
        }
        return shippingFee;
      },

      getTotalAmount: () => {
        return get().getSubtotal() + get().getShippingFee();
      },
    }),
    {
      name: "kavel_cart_state_v1",
      partialize: (state) => ({
        items: state.items,
        basePrice55: state.basePrice55,
        basePrice110: state.basePrice110,
        shippingFee: state.shippingFee,
      }),
    }
  )
);
