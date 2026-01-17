import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

async function getCollections() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/collections`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch collections");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching collections:", error);
    return { collections: [] };
  }
}

export default async function CollectionsPage() {
  const { collections } = await getCollections();

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Collections</h1>
      {collections.length === 0 ? (
        <p className="text-muted-foreground">No collections found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection: any) => (
            <Card key={collection.id} className="overflow-hidden group">
              <Link href={`/collections/${collection.handle}`}>
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {collection.title}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
