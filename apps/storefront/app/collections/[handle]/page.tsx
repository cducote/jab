import { Container } from "@/components/layout/container";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";

async function getCollection(handle: string) {
  // Temporarily commented out - API request disabled
  // try {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/collections/${handle}?first=20`,
  //     { cache: "no-store" }
  //   );
  //   if (!res.ok) {
  //     if (res.status === 404) {
  //       return null;
  //     }
  //     throw new Error("Failed to fetch collection");
  //   }
  //   return res.json();
  // } catch (error) {
  //   console.error("Error fetching collection:", error);
  //   return null;
  // }
  return null;
}

export default async function CollectionPage({
  params,
}: {
  params: { handle: string };
}) {
  const data = await getCollection(params.handle);

  if (!data || !data.collection) {
    notFound();
  }

  const { collection, products } = data;

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" },
          { label: collection.title },
        ]}
        className="mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">{collection.title}</h1>
      {collection.description && (
        <p className="text-muted-foreground mb-8">{collection.description}</p>
      )}
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products in this collection.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden group">
              <Link href={`/products/${product.handle}`}>
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold">
                    {formatPrice(product.price, product.currencyCode)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" asChild>
                    <Link href={`/products/${product.handle}`}>
                      View Product
                    </Link>
                  </Button>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
