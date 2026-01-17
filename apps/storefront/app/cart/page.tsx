"use client";

import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { X, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const total = getTotalPrice();
  const totalItems = getTotalItems();
  const currencyCode = items[0]?.currencyCode || "USD";

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-muted-foreground mb-8">
            Your cart is empty. Start shopping to add items!
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({totalItems} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.variantId}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {item.image && (
                    <Link href={`/products/${item.productId}`}>
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    {item.variantTitle && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.variantTitle}
                      </p>
                    )}
                    <p className="text-lg font-semibold mb-4">
                      {formatPrice(item.price, item.currencyCode)}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.variantId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total.toString(), currencyCode)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total.toString(), currencyCode)}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
