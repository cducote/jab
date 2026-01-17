import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/constants";
import { saveShopifySettings } from "@/lib/shopify-settings";

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

    const settings = await saveShopifySettings({
      storeDomain,
      storefrontAccessToken,
      apiVersion,
    });

    return NextResponse.json({
      success: true,
      settings: {
        id: settings.id,
        storeDomain: settings.storeDomain,
        apiVersion: settings.apiVersion,
        isConnected: settings.isConnected,
      },
    });
  } catch (error: any) {
    console.error("Error saving Shopify settings:", error);
    return NextResponse.json(
      {
        error: "Failed to save settings",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
