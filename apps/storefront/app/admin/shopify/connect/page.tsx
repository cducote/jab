import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminUser } from "@/lib/constants";
import { Container } from "@/components/layout/container";
import { ShopifyConnectionForm } from "@/components/admin/shopify-connection-form";

export default async function ShopifyConnectPage() {
  const user = await getCurrentUser();

  if (!isAdminUser(user?.email)) {
    redirect("/");
  }

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Connect Shopify Store</h1>
        <ShopifyConnectionForm />
      </div>
    </Container>
  );
}
