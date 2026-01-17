import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/constants";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { db } from "@/lib/db";
import { shopifySettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!isAdminUser(user?.email)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { storeDomain, storefrontAccessToken, apiVersion } = body;

    if (!storeDomain || !storefrontAccessToken) {
      return NextResponse.json(
        { error: "Store domain and access token are required" },
        { status: 400 }
      );
    }

    // Validate store domain format
    if (!storeDomain.endsWith(".myshopify.com")) {
      return NextResponse.json(
        { error: "Store domain must end with .myshopify.com" },
        { status: 400 }
      );
    }

    // Test connection by making a simple query
    const testClient = createStorefrontApiClient({
      storeDomain,
      apiVersion: apiVersion || "2024-10",
      publicAccessToken: storefrontAccessToken,
    });

    // Test query to get shop info
    const testQuery = `
      query {
        shop {
          name
          myshopifyDomain
          currencyCode
        }
      }
    `;

    const response = await testClient.request(testQuery);

    if (response.errors) {
      return NextResponse.json(
        {
          error: "Connection failed",
          details: response.errors,
        },
        { status: 400 }
      );
    }

    // Update connection status if this is an existing connection in the database
    try {
      const existing = await db
        .select()
        .from(shopifySettings)
        .where(eq(shopifySettings.storeDomain, storeDomain))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(shopifySettings)
          .set({
            lastTestedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(shopifySettings.storeDomain, storeDomain));
      }
    } catch (error) {
      // Ignore errors updating status, test was successful
      console.error("Error updating connection status:", error);
    }

    return NextResponse.json({
      success: true,
      shop: response.data?.shop,
    });
  } catch (error: any) {
    console.error("Shopify connection test error:", error);
    return NextResponse.json(
      {
        error: "Connection test failed",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
