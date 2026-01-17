import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/constants";
import { getShopifySettings } from "@/lib/shopify-settings";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!isAdminUser(user?.email)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const settings = await getShopifySettings();

    if (!settings) {
      return NextResponse.json({
        connected: false,
        settings: null,
      });
    }

    return NextResponse.json({
      connected: settings.isConnected,
      settings: {
        id: settings.id,
        storeDomain: settings.storeDomain,
        apiVersion: settings.apiVersion,
        isConnected: settings.isConnected,
        lastTestedAt: settings.lastTestedAt,
        // Don't return the token for security
      },
    });
  } catch (error: any) {
    console.error("Error fetching Shopify status:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch status",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
