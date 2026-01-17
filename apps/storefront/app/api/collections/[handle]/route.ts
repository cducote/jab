import { NextResponse } from "next/server";
import { executeShopifyQuery, shopifyQueries } from "@/lib/shopify";
import { ShopifyCollectionResponse } from "@/types/shopify";
import { normalizeProduct } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const first = parseInt(searchParams.get("first") || "20");
    const after = searchParams.get("after") || undefined;

    const data = await executeShopifyQuery<ShopifyCollectionResponse>(
      shopifyQueries.collection,
      { handle: params.handle, first, after: after || null }
    );

    if (!data.collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    const products =
      data.collection.products?.edges.map((edge) =>
        normalizeProduct(edge.node)
      ) || [];

    return NextResponse.json({
      collection: data.collection,
      products,
      pageInfo: data.collection.products?.pageInfo,
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
