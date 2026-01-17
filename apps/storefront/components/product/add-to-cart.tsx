"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ShopifyVariant, ShopifyProduct } from "@/types/shopify";

interface AddToCartProps {
  product: ShopifyProduct;
}

export function AddToCart({ product }: AddToCartProps) {
  const { addItem, openCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants.edges[0]?.node.id || ""
  );
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = product.variants.edges.find(
    (edge) => edge.node.id === selectedVariantId
  )?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setIsAdding(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem({
      id: product.id,
      productId: product.handle,
      variantId: selectedVariant.id,
      title: product.title,
      price: selectedVariant.price.amount,
      currencyCode: selectedVariant.price.currencyCode,
      image: product.images.edges[0]?.node.url,
      variantTitle: selectedVariant.title !== "Default Title" ? selectedVariant.title : undefined,
    });

    setIsAdding(false);
    openCart();
  };

  if (!selectedVariant || !selectedVariant.availableForSale) {
    return (
      <Button size="lg" className="w-full" disabled>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {product.variants.edges.length > 1 && (
        <div>
          <label className="block text-sm font-medium mb-2">Variant</label>
          <Select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
          >
            {product.variants.edges.map((edge) => (
              <option key={edge.node.id} value={edge.node.id}>
                {edge.node.title} - {edge.node.price.currencyCode}{" "}
                {edge.node.price.amount}
              </option>
            ))}
          </Select>
        </div>
      )}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
}
