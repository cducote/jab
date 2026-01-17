import { NextResponse } from "next/server";
import { executeShopifyQuery, shopifyQueries } from "@/lib/shopify";
import { ShopifyProductsResponse } from "@/types/shopify";
import { normalizeProduct } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "20");
    const after = searchParams.get("after") || undefined;

    const data = await executeShopifyQuery<ShopifyProductsResponse>(
      shopifyQueries.products,
      { first, after: after || null }
    );

    const products = data.products.edges.map((edge) =>
      normalizeProduct(edge.node)
    );

    return NextResponse.json({
      products,
      pageInfo: data.products.pageInfo,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
