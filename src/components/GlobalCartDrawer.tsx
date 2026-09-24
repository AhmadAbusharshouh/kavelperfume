"use client";

import { useCartStore } from "@/lib/cartStore";
import { CartDrawer } from "./CartDrawer";

export function GlobalCartDrawer() {
  const { isDrawerOpen, setDrawerOpen } = useCartStore();

  return (
    <CartDrawer
      isOpen={isDrawerOpen}
      onClose={() => setDrawerOpen(false)}
    />
  );
}
