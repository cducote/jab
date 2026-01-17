import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { getShopifySettings } from "./shopify-settings";

async function getShopifyClient() {
  // Try to get settings from database first
  const settings = await getShopifySettings();
  
  if (settings) {
    return createStorefrontApiClient({
      storeDomain: settings.storeDomain,
      apiVersion: settings.apiVersion,
      publicAccessToken: settings.storefrontAccessToken,
    });
  }

  // Fallback to environment variables
  if (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return createStorefrontApiClient({
      storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
      apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-10",
      publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });
  }

  // Return null if no configuration available
  return null;
}

// For backward compatibility, export a function that gets the client
export const shopifyClient = {
  async request(query: string, options?: { variables?: Record<string, unknown>; retries?: number }) {
    const client = await getShopifyClient();
    if (!client) {
      throw new Error("Shopify client not configured. Please connect your Shopify store in admin settings.");
    }
    return client.request(query, options);
  },
};

// GraphQL query helpers
export const shopifyQueries = {
  products: `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `,
  product: `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  `,
  collections: `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `,
  collection: `
    query getCollection($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
  `,
};

// Helper function to execute queries with error handling and retry logic
export async function executeShopifyQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const response = await shopifyClient.request(query, {
      variables,
      retries: 2,
    });

    if (response.errors) {
      throw new Error(
        `Shopify API errors: ${JSON.stringify(response.errors)}`
      );
    }

    return response.data as T;
  } catch (error) {
    console.error("Shopify API error:", error);
    throw error;
  }
}
