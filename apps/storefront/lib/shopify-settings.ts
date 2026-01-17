import { db } from "@/lib/db";
import { shopifySettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getShopifySettings() {
  try {
    const settings = await db
      .select()
      .from(shopifySettings)
      .where(eq(shopifySettings.isConnected, true))
      .limit(1);

    return settings[0] || null;
  } catch (error) {
    console.error("Error fetching Shopify settings:", error);
    return null;
  }
}

export async function saveShopifySettings(data: {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion?: string;
}) {
  try {
    const existing = await db
      .select()
      .from(shopifySettings)
      .where(eq(shopifySettings.storeDomain, data.storeDomain))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(shopifySettings)
        .set({
          storefrontAccessToken: data.storefrontAccessToken,
          apiVersion: data.apiVersion || "2024-10",
          isConnected: true,
          updatedAt: new Date(),
        })
        .where(eq(shopifySettings.storeDomain, data.storeDomain))
        .returning();

      return updated;
    } else {
      const [created] = await db
        .insert(shopifySettings)
        .values({
          storeDomain: data.storeDomain,
          storefrontAccessToken: data.storefrontAccessToken,
          apiVersion: data.apiVersion || "2024-10",
          isConnected: true,
        })
        .returning();

      return created;
    }
  } catch (error) {
    console.error("Error saving Shopify settings:", error);
    throw error;
  }
}

export async function updateConnectionStatus(
  storeDomain: string,
  isConnected: boolean
) {
  try {
    const result = await db
      .update(shopifySettings)
      .set({
        isConnected,
        lastTestedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(shopifySettings.storeDomain, storeDomain))
      .returning();
    
    return result[0] || null;
  } catch (error) {
    console.error("Error updating connection status:", error);
    throw error;
  }
}
