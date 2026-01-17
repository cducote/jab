import { NextResponse } from "next/server";
import { executeShopifyQuery, shopifyQueries } from "@/lib/shopify";
import { ShopifyProductResponse } from "@/types/shopify";
import { normalizeProduct } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const data = await executeShopifyQuery<ShopifyProductResponse>(
      shopifyQueries.product,
      { handle: params.handle }
    );

    if (!data.product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = normalizeProduct(data.product);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
