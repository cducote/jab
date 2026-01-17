"use client";

import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  const { openCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="default"
      size="sm"
      onClick={openCart}
      className="relative"
      aria-label={`Open cart, ${totalItems} items`}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Cart
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}
