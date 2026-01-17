import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isAdminUser } from "@/lib/constants";

export default async function AccountPage() {
  const user = await getCurrentUser();

  // Redirect non-admin users
  if (!isAdminUser(user?.email)) {
    redirect("/");
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/account/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View your order history and track shipments
            </p>
            <Button className="w-full" asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your shipping addresses
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/account/addresses">Manage Addresses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
