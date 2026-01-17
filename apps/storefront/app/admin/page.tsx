import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isAdminUser } from "@/lib/constants";
import { ShopifyStatus } from "@/components/admin/shopify-status";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!isAdminUser(user?.email)) {
    redirect("/");
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage site content, images, and settings
            </p>
            <Button className="w-full" asChild>
              <Link href="/admin/cms">Open CMS</Link>
            </Button>
          </CardContent>
        </Card>

        <ShopifyStatus />

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure site settings and preferences
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/settings">Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
