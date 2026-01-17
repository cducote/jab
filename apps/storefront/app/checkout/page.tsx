"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

type CheckoutStep = "customer" | "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("customer");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "US",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const total = getTotalPrice();
  const currencyCode = items[0]?.currencyCode || "USD";

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add items to your cart to checkout
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </Container>
    );
  }

  const handleNext = () => {
    if (step === "customer") {
      if (!formData.email || !formData.firstName || !formData.lastName) {
        setError("Please fill in all required fields");
        return;
      }
      setStep("shipping");
    } else if (step === "shipping") {
      if (!formData.address1 || !formData.city || !formData.zip || !formData.country) {
        setError("Please fill in all required shipping fields");
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    }
    setError("");
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError("");

    try {
      // In a real implementation, this would create a checkout session with Shopify
      // For now, we'll simulate order creation
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerInfo: formData,
          total,
          currencyCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to process checkout");
        setIsProcessing(false);
        return;
      }

      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <Card className="border-destructive">
              <CardContent className="p-4">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Customer Information */}
          {step === "customer" && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Address */}
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="address1" className="block text-sm font-medium mb-2">
                    Address *
                  </label>
                  <Input
                    id="address1"
                    value={formData.address1}
                    onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address2" className="block text-sm font-medium mb-2">
                    Apartment, suite, etc. (optional)
                  </label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium mb-2">
                      State/Province
                    </label>
                    <Input
                      id="province"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium mb-2">
                      ZIP/Postal Code *
                    </label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-2">
                      Country *
                    </label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Payment will be processed securely through Shopify Checkout.
                  You will be redirected to complete payment.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Review */}
          {step === "review" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Shipping To:</h3>
                  <p className="text-sm">
                    {formData.firstName} {formData.lastName}
                    <br />
                    {formData.address1}
                    {formData.address2 && <>, {formData.address2}</>}
                    <br />
                    {formData.city}, {formData.province} {formData.zip}
                    <br />
                    {formData.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex justify-between text-sm">
                        <span>
                          {item.title} x {item.quantity}
                        </span>
                        <span>{formatPrice(item.price, item.currencyCode)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            {step !== "customer" && (
              <Button variant="outline" onClick={() => {
                if (step === "shipping") setStep("customer");
                else if (step === "payment") setStep("shipping");
                else if (step === "review") setStep("payment");
                setError("");
              }}>
                Back
              </Button>
            )}
            {step !== "review" ? (
              <Button onClick={handleNext} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Complete Order"}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex justify-between text-sm">
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price, item.currencyCode)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total.toString(), currencyCode)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
