"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "instructions" | "credentials" | "testing" | "complete";

export function ShopifyConnectionForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("instructions");
  const [formData, setFormData] = useState({
    storeDomain: "",
    storefrontAccessToken: "",
    apiVersion: "2024-10",
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [shopInfo, setShopInfo] = useState<any>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError("");
    setStep("testing");

    try {
      const response = await fetch("/api/admin/shopify/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Connection test failed");
        setStep("credentials");
        return;
      }

      setShopInfo(data.shop);
      setStep("complete");
    } catch (error: any) {
      setError(error.message || "Connection test failed");
      setStep("credentials");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/shopify/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to save settings");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Instructions */}
      {step === "instructions" && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Shopify Store</CardTitle>
            <CardDescription>
              Follow these steps to create a Storefront API access token
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Step 1: Access Shopify Admin</h3>
                <p className="text-muted-foreground">
                  Go to your Shopify admin dashboard
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Step 2: Navigate to Apps</h3>
                <p className="text-muted-foreground">
                  In the left-hand navigation, click <strong>Apps</strong> → <strong>App Settings</strong> → <strong>Develop</strong> → <strong>Build apps in Dev Dashboard</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  (Opens in a new tab)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Step 3: Create App</h3>
                <p className="text-muted-foreground">
                  Click <strong>Create an app</strong> and give it a name (e.g., "Headless Storefront")
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Step 4: Configure Storefront API</h3>
                <p className="text-muted-foreground">
                  Click <strong>Configure Admin API scopes</strong> or find <strong>Storefront API</strong> section
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Step 5: Install & Get Token</h3>
                <p className="text-muted-foreground">
                  Install the app and copy the <strong>Storefront API access token</strong>
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <a
                href="https://shopify.dev/docs/apps/auth/access-tokens/storefront-api-access-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Shopify Documentation →
              </a>
            </div>
            <Button onClick={() => setStep("credentials")} className="w-full">
              I Have My Token
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Credentials */}
      {step === "credentials" && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Shopify Credentials</CardTitle>
            <CardDescription>
              Enter your store domain and Storefront API access token
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="storeDomain" className="block text-sm font-medium mb-2">
                Store Domain *
              </label>
              <Input
                id="storeDomain"
                type="text"
                placeholder="your-store.myshopify.com"
                value={formData.storeDomain}
                onChange={(e) => setFormData({ ...formData, storeDomain: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your Shopify store domain (must end with .myshopify.com)
              </p>
            </div>
            <div>
              <label htmlFor="storefrontAccessToken" className="block text-sm font-medium mb-2">
                Storefront API Access Token *
              </label>
              <Input
                id="storefrontAccessToken"
                type="password"
                placeholder="shpat_xxxxxxxxxxxxx"
                value={formData.storefrontAccessToken}
                onChange={(e) => setFormData({ ...formData, storefrontAccessToken: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                The Storefront API access token from your Shopify app
              </p>
            </div>
            <div>
              <label htmlFor="apiVersion" className="block text-sm font-medium mb-2">
                API Version
              </label>
              <Input
                id="apiVersion"
                type="text"
                value={formData.apiVersion}
                onChange={(e) => setFormData({ ...formData, apiVersion: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Shopify API version (default: 2024-10)
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep("instructions")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleTestConnection}
                disabled={isTesting || !formData.storeDomain || !formData.storefrontAccessToken}
                className="flex-1"
              >
                {isTesting ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Testing */}
      {step === "testing" && (
        <Card>
          <CardHeader>
            <CardTitle>Testing Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please wait while we test your connection...</p>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Complete */}
      {step === "complete" && shopInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Connection Successful!</CardTitle>
            <CardDescription>
              Your Shopify store is connected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-md">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Store Name:</span> {shopInfo.name}
                </div>
                <div>
                  <span className="font-semibold">Domain:</span> {shopInfo.myshopifyDomain}
                </div>
                <div>
                  <span className="font-semibold">Currency:</span> {shopInfo.currencyCode}
                </div>
              </div>
            </div>
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? "Saving..." : "Save Connection"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
