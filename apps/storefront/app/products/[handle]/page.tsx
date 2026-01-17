import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/product/add-to-cart";
import type { ShopifyProduct } from "@/types/shopify";

async function getProduct(handle: string) {
  // Temporarily commented out - API request disabled
  // try {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products/${handle}`,
  //     { cache: "no-store" }
  //   );
  //   if (!res.ok) {
  //     if (res.status === 404) {
  //       return null;
  //     }
  //     throw new Error("Failed to fetch product");
  //   }
  //   return res.json();
  // } catch (error) {
  //   console.error("Error fetching product:", error);
  //   return null;
  // }
  return null;
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const data = await getProduct(params.handle);

  if (!data || !data.product) {
    notFound();
  }

  const product: ShopifyProduct = data.product;
  const mainImage = product.images?.edges[0]?.node;
  const otherImages = product.images?.edges.slice(1).map(edge => edge.node) || [];

  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {mainImage && (
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
              <Image
                src={mainImage?.url || ""}
                alt={mainImage?.altText || product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
          {otherImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {otherImages.map((image: any, index: number) => (
                <div
                  key={index}
                  className="aspect-square relative overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={image?.url || ""}
                    alt={image?.altText || `${product.title} ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-2xl font-semibold mb-6">
              {formatPrice(product.price, product.currencyCode)}
            </p>
          </div>

          {product.description && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">Description</h2>
                {product.descriptionHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    className="prose prose-sm max-w-none"
                  />
                ) : (
                  <p className="text-muted-foreground">{product.description}</p>
                )}
              </CardContent>
            </Card>
          )}

          <AddToCart product={product} />
        </div>
      </div>
    </Container>
  );
}
