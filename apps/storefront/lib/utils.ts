import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to normalize Shopify product data
export function normalizeProduct(product: any): any {
  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    price: product.priceRange?.minVariantPrice?.amount || "0",
    currencyCode: product.priceRange?.minVariantPrice?.currencyCode || "USD",
    images: product.images?.edges?.map((edge: any) => edge.node) || [],
    variants: product.variants?.edges?.map((edge: any) => edge.node) || [],
    options: product.options || [],
  };
}

// Format price
export function formatPrice(
  amount: string,
  currencyCode: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}
