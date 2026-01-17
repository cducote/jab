import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerInfo, total, currencyCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${randomBytes(4).toString("hex").toUpperCase()}`;

    // Create order in database
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        email: customerInfo.email,
        totalPrice: total.toString(),
        currencyCode: currencyCode || "USD",
        status: "pending",
        shippingAddress: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          address1: customerInfo.address1,
          address2: customerInfo.address2,
          city: customerInfo.city,
          province: customerInfo.province,
          zip: customerInfo.zip,
          country: customerInfo.country,
          phone: customerInfo.phone,
        },
        lineItems: items,
      })
      .returning();

    // In a real implementation, you would:
    // 1. Create a checkout session with Shopify
    // 2. Redirect to Shopify checkout
    // 3. Handle webhook for order completion

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
