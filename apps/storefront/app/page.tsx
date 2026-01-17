import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

async function getProducts() {
  // Temporarily commented out - API request disabled
  // try {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products?first=8`,
  //     { cache: "no-store" }
  //   );
  //   if (!res.ok) {
  //     throw new Error("Failed to fetch products");
  //   }
  //   return res.json();
  // } catch (error) {
  //   console.error("Error fetching products:", error);
  //   return { products: [], pageInfo: null };
  // }
  return { products: [], pageInfo: null };
}

export default async function HomePage() {
  const { products } = await getProducts();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center">
        <Container>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our Store
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing products with a modern shopping experience
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/collections">Browse Collections</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 bg-muted/50">
          <Container>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product: any) => (
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
                      <p className="text-lg font-bold">
                        {formatPrice(product.price, product.currencyCode)}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/products/${product.handle}`}>
                          View Product
                        </Link>
                      </Button>
                    </CardFooter>
                  </Link>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
