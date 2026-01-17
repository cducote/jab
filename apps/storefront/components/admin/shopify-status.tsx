"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ShopifyStatusData {
  connected: boolean;
  settings: {
    storeDomain: string;
    apiVersion: string;
    lastTestedAt: string | null;
  } | null;
}

export function ShopifyStatus() {
  const [status, setStatus] = useState<ShopifyStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/admin/shopify/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching Shopify status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shopify Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!status?.connected || !status.settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>+ Connect Shopify</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your Shopify store to enable product sync and order management
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin/shopify/connect">Connect Store</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopify Connected</CardTitle>
        <CardDescription>
          Your store is connected and ready
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Store:</span>{" "}
            <span className="font-medium">{status.settings.storeDomain}</span>
          </div>
          <div>
            <span className="text-muted-foreground">API Version:</span>{" "}
            <span className="font-medium">{status.settings.apiVersion}</span>
          </div>
          {status.settings.lastTestedAt && (
            <div>
              <span className="text-muted-foreground">Last Tested:</span>{" "}
              <span className="font-medium">
                {new Date(status.settings.lastTestedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/admin/shopify/connect">Manage Connection</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
