import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminUser } from "@/lib/constants";

export default async function CMSPage() {
  const user = await getCurrentUser();

  if (!isAdminUser(user?.email)) {
    redirect("/");
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Content Management System</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Site Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Micro CMS coming soon! This will allow you to edit:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Header images and branding</li>
            <li>Homepage content</li>
            <li>Footer information</li>
            <li>Site-wide settings</li>
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
