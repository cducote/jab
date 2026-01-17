import { NextResponse } from "next/server";
import { executeShopifyQuery, shopifyQueries } from "@/lib/shopify";
import { ShopifyCollectionsResponse } from "@/types/shopify";

export async function GET() {
  try {
    const data = await executeShopifyQuery<ShopifyCollectionsResponse>(
      shopifyQueries.collections,
      { first: 50 }
    );

    return NextResponse.json({
      collections: data.collections.edges.map((edge) => edge.node),
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
