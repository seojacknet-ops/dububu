# 🐻🐼 DUBUBU PRODUCTION BUILD - CLAUDE CODE AUTOPILOT PROMPT

> **Usage:** `claude --dangerously-skip-permissions` then paste this entire prompt
> **Project:** DuBuBu - Bubu & Dudu Merchandise Dropshipping + POD Store
> **Target Stack:** Next.js 14+ | Convex | Clerk | Stripe | PayPal | Printful | AliExpress

---

## 🎯 MISSION BRIEFING

You are operating in **FULL AUTOPILOT MODE** with complete permissions. Your mission is to transform the DuBuBu merchandise store from beta (Firebase-based) to a production-ready hybrid e-commerce platform supporting:

1. **AliExpress Dropshipping** - Pre-made Bubu & Dudu products (plushies, keychains, etc.)
2. **Printful POD** - Custom apparel, mugs, accessories with Bubu & Dudu designs

**DO NOT ASK FOR PERMISSION. DO NOT PAUSE FOR CONFIRMATION. EXECUTE AUTONOMOUSLY.**

---

## 📋 CURRENT STATE ANALYSIS

**Live Site:** https://www.dububu.com/
**Brand:** DuBuBu - "Where Love Meets Cute" 🐻🐼
**Niche:** Bubu & Dudu fan merchandise (couple gifts, cute accessories)
**Tagline:** "Your daily dose of adorable"

### Existing Features to Preserve:
- Hero section with animated GIFs
- Category navigation (Plushies, Apparel, Accessories, Gift Sets, Matching Sets)
- Best sellers showcase
- Instagram integration (@dububu.co)
- Trust badges (Free Shipping $50+, 30-Day Returns, Secure Checkout)
- Newsletter signup (10% off first order)
- Fan-made merchandise disclaimer
- Clean, romantic aesthetic with pink/white theme

### Product Categories:
- Plushies (AliExpress)
- Apparel - Hoodies, T-shirts (Printful POD)
- Accessories - Keychains, Phone cases (Mixed)
- Gift Sets (Bundles)
- Matching Sets (Couples items)
- Mugs (Printful POD)

### Current Pricing Examples:
- Classic Bubu & Dudu Plush Set: $34.99
- Matching Couple Hoodies: $59.99
- Love Story Mug Set: $24.99
- Cute Panda Keychain: $12.99

### Current Tech (TO BE REPLACED):
- Firebase (Auth + Firestore)
- Unknown payment processor

### Target Stack:
- **Convex** - Real-time database + backend functions
- **Clerk** - Authentication (guest checkout + accounts)
- **Stripe** - Primary payment processor
- **PayPal** - Secondary payment option
- **Printful API** - POD fulfillment
- **AliExpress/CJ Dropshipping** - Product fulfillment
- **Next.js 14+** - App Router (keep/upgrade)
- **Tailwind CSS** - Styling (keep)
- **Vercel** - Deployment (keep)

---

## 🔄 PHASE 1: REPOSITORY AUDIT & CLEANUP

### Step 1.1: Initial Analysis
```bash
# Run these commands first
tree -I 'node_modules|.git|.next' -L 4
cat package.json
cat tsconfig.json
ls -la .env* 2>/dev/null || echo "No env files found"
find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "firebase" 2>/dev/null
```

### Step 1.2: Document Current Architecture
Create `docs/MIGRATION-AUDIT.md` with:
- Current file structure
- All Firebase imports/usage locations
- Current API routes
- Current data models
- Environment variables needed

### Step 1.3: Dependency Cleanup
```bash
# Remove Firebase dependencies
npm uninstall firebase firebase-admin @firebase/app @firebase/auth @firebase/firestore

# Install new stack
npm install convex @clerk/nextjs @clerk/themes stripe @stripe/stripe-js @paypal/react-paypal-js

# Install utilities
npm install zod zustand @tanstack/react-query sonner uuid nanoid

# Install for Printful/fulfillment
npm install axios
```

---

## 🏗️ PHASE 2: CONVEX SETUP

### Step 2.1: Initialize Convex
```bash
npx convex dev --once  # Initialize and create convex/ folder
```

### Step 2.2: Create Schema (`convex/schema.ts`)
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Products (supports both AliExpress dropship and Printful POD)
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    category: v.string(), // plushies, apparel, accessories, gift-sets, matching-sets
    subcategory: v.optional(v.string()),
    
    // Pricing
    basePrice: v.number(),
    compareAtPrice: v.optional(v.number()),
    costPrice: v.number(), // For profit tracking
    
    // Images
    images: v.array(v.string()),
    thumbnailGif: v.optional(v.string()), // Animated preview
    
    // Variants (size, color, etc.)
    variants: v.array(v.object({
      id: v.string(),
      name: v.string(),
      sku: v.string(),
      price: v.number(),
      costPrice: v.number(),
      stock: v.optional(v.number()), // null = unlimited (POD)
      image: v.optional(v.string()),
      options: v.object({
        size: v.optional(v.string()),
        color: v.optional(v.string()),
        style: v.optional(v.string()),
      }),
    })),
    
    // Fulfillment
    fulfillmentType: v.union(
      v.literal("aliexpress"),
      v.literal("printful"),
      v.literal("manual")
    ),
    aliexpressProductId: v.optional(v.string()),
    aliexpressUrl: v.optional(v.string()),
    printfulProductId: v.optional(v.string()),
    printfulSyncVariants: v.optional(v.array(v.object({
      variantId: v.string(),
      printfulVariantId: v.number(),
    }))),
    
    // Metadata
    tags: v.array(v.string()),
    isFeatured: v.boolean(),
    isBestSeller: v.boolean(),
    isNewArrival: v.boolean(),
    isActive: v.boolean(),
    
    // SEO
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    
    // Stats
    salesCount: v.number(),
    viewCount: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_featured", ["isFeatured"])
    .index("by_bestSeller", ["isBestSeller"]),

  // Collections (for curated groupings)
  collections: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    image: v.string(),
    productIds: v.array(v.id("products")),
    isActive: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  // Orders
  orders: defineTable({
    orderNumber: v.string(),
    userId: v.optional(v.string()), // Clerk user ID
    email: v.string(),
    
    // Status tracking
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("partially_shipped"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    
    // Items with fulfillment tracking
    items: v.array(v.object({
      productId: v.id("products"),
      variantId: v.string(),
      variantSku: v.string(),
      productName: v.string(),
      variantName: v.string(),
      quantity: v.number(),
      price: v.number(),
      costPrice: v.number(),
      image: v.string(),
      fulfillmentType: v.union(
        v.literal("aliexpress"),
        v.literal("printful"),
        v.literal("manual")
      ),
      fulfillmentStatus: v.union(
        v.literal("pending"),
        v.literal("submitted"),
        v.literal("in_production"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("failed")
      ),
      fulfillmentOrderId: v.optional(v.string()),
      trackingNumber: v.optional(v.string()),
      trackingUrl: v.optional(v.string()),
    })),
    
    // Pricing breakdown
    subtotal: v.number(),
    discount: v.number(),
    discountCode: v.optional(v.string()),
    shipping: v.number(),
    tax: v.number(),
    total: v.number(),
    profit: v.number(), // Calculated from prices - costs
    
    // Shipping info
    shippingAddress: v.object({
      firstName: v.string(),
      lastName: v.string(),
      company: v.optional(v.string()),
      address1: v.string(),
      address2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
      phone: v.string(),
    }),
    shippingMethod: v.string(),
    
    // Payment info
    paymentMethod: v.union(v.literal("stripe"), v.literal("paypal")),
    paymentIntentId: v.optional(v.string()),
    paypalOrderId: v.optional(v.string()),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    
    // Customer notes
    customerNotes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    
    // Gift options
    isGift: v.boolean(),
    giftMessage: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // Reviews
  reviews: defineTable({
    productId: v.id("products"),
    orderId: v.optional(v.id("orders")),
    userId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    rating: v.number(), // 1-5
    title: v.string(),
    content: v.string(),
    images: v.optional(v.array(v.string())),
    isVerifiedPurchase: v.boolean(),
    isApproved: v.boolean(),
    helpful: v.number(),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_approved", ["isApproved"]),

  // Cart
  carts: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      variantId: v.string(),
      quantity: v.number(),
    })),
    appliedDiscount: v.optional(v.object({
      code: v.string(),
      type: v.string(),
      value: v.number(),
    })),
    updatedAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),

  // Discount Codes
  discountCodes: defineTable({
    code: v.string(),
    type: v.union(
      v.literal("percentage"),
      v.literal("fixed"),
      v.literal("free_shipping"),
      v.literal("buy_x_get_y")
    ),
    value: v.number(),
    minPurchase: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    usedCount: v.number(),
    usedByEmails: v.array(v.string()),
    applicableCategories: v.optional(v.array(v.string())),
    applicableProducts: v.optional(v.array(v.id("products"))),
    validFrom: v.number(),
    validUntil: v.number(),
    isActive: v.boolean(),
    isFirstOrderOnly: v.boolean(),
  }).index("by_code", ["code"]),

  // Newsletter Subscribers
  subscribers: defineTable({
    email: v.string(),
    firstName: v.optional(v.string()),
    source: v.string(), // popup, footer, checkout
    discountCodeSent: v.optional(v.string()),
    subscribedAt: v.number(),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),

  // Wishlist
  wishlists: defineTable({
    userId: v.string(),
    productIds: v.array(v.id("products")),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Contact Messages
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    orderNumber: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied"), v.literal("resolved")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  // Printful webhook events (for tracking)
  printfulEvents: defineTable({
    eventType: v.string(),
    orderId: v.optional(v.id("orders")),
    printfulOrderId: v.string(),
    data: v.any(),
    processedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_printfulOrderId", ["printfulOrderId"]),
});
```

### Step 2.3: Create Core Product Functions (`convex/products.ts`)
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products").filter((q) => q.eq(q.field("isActive"), true));
    
    if (args.category) {
      q = ctx.db.query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category))
        .filter((q) => q.eq(q.field("isActive"), true));
    }
    
    const products = await q.collect();
    return args.limit ? products.slice(0, args.limit) : products;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getBestSellers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_bestSeller", (q) => q.eq("isBestSeller", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return products.slice(0, args.limit || 8);
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase();
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.some((t) => t.toLowerCase().includes(searchTerm))
    );
  },
});

export const incrementView = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, {
        viewCount: product.viewCount + 1,
      });
    }
  },
});
```

### Step 2.4: Create Order Functions (`convex/orders.ts`)
```typescript
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DB-${timestamp}-${random}`;
}

export const create = mutation({
  args: {
    email: v.string(),
    userId: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      variantId: v.string(),
      variantSku: v.string(),
      productName: v.string(),
      variantName: v.string(),
      quantity: v.number(),
      price: v.number(),
      costPrice: v.number(),
      image: v.string(),
      fulfillmentType: v.union(
        v.literal("aliexpress"),
        v.literal("printful"),
        v.literal("manual")
      ),
    })),
    subtotal: v.number(),
    discount: v.number(),
    discountCode: v.optional(v.string()),
    shipping: v.number(),
    tax: v.number(),
    total: v.number(),
    shippingAddress: v.object({
      firstName: v.string(),
      lastName: v.string(),
      company: v.optional(v.string()),
      address1: v.string(),
      address2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
      phone: v.string(),
    }),
    shippingMethod: v.string(),
    paymentMethod: v.union(v.literal("stripe"), v.literal("paypal")),
    isGift: v.optional(v.boolean()),
    giftMessage: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Calculate profit
    const totalCost = args.items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
    const profit = args.total - totalCost - args.shipping;
    
    // Add fulfillment status to items
    const itemsWithStatus = args.items.map((item) => ({
      ...item,
      fulfillmentStatus: "pending" as const,
    }));
    
    return await ctx.db.insert("orders", {
      orderNumber: generateOrderNumber(),
      email: args.email,
      userId: args.userId,
      status: "pending",
      items: itemsWithStatus,
      subtotal: args.subtotal,
      discount: args.discount,
      discountCode: args.discountCode,
      shipping: args.shipping,
      tax: args.tax,
      total: args.total,
      profit,
      shippingAddress: args.shippingAddress,
      shippingMethod: args.shippingMethod,
      paymentMethod: args.paymentMethod,
      paymentStatus: "pending",
      isGift: args.isGift || false,
      giftMessage: args.giftMessage,
      customerNotes: args.customerNotes,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentIntentId: v.optional(v.string()),
    paypalOrderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      paymentStatus: args.paymentStatus,
      updatedAt: Date.now(),
    };
    
    if (args.paymentIntentId) updates.paymentIntentId = args.paymentIntentId;
    if (args.paypalOrderId) updates.paypalOrderId = args.paypalOrderId;
    
    if (args.paymentStatus === "paid") {
      updates.status = "paid";
    }
    
    await ctx.db.patch(args.orderId, updates);
  },
});

export const updateFulfillmentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    itemIndex: v.number(),
    fulfillmentStatus: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("in_production"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("failed")
    ),
    fulfillmentOrderId: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    trackingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    
    const updatedItems = [...order.items];
    updatedItems[args.itemIndex] = {
      ...updatedItems[args.itemIndex],
      fulfillmentStatus: args.fulfillmentStatus,
      fulfillmentOrderId: args.fulfillmentOrderId || updatedItems[args.itemIndex].fulfillmentOrderId,
      trackingNumber: args.trackingNumber || updatedItems[args.itemIndex].trackingNumber,
      trackingUrl: args.trackingUrl || updatedItems[args.itemIndex].trackingUrl,
    };
    
    // Check if all items are shipped
    const allShipped = updatedItems.every((item) => item.fulfillmentStatus === "shipped");
    const anyShipped = updatedItems.some((item) => item.fulfillmentStatus === "shipped");
    
    await ctx.db.patch(args.orderId, {
      items: updatedItems,
      status: allShipped ? "shipped" : anyShipped ? "partially_shipped" : order.status,
      updatedAt: Date.now(),
    });
  },
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .order("desc")
      .collect();
  },
});
```

---

## 🔐 PHASE 3: CLERK AUTHENTICATION

### Step 3.1: Middleware (`middleware.ts`)
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/shop(.*)",
  "/collections(.*)",
  "/products(.*)",
  "/gift-guide",
  "/faq",
  "/contact",
  "/shipping",
  "/track-order",
  "/privacy",
  "/terms",
  "/checkout(.*)",
  "/order-confirmation(.*)",
  "/api/webhooks(.*)",
  "/api/stripe(.*)",
  "/api/paypal(.*)",
  "/api/printful(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Step 3.2: Providers (`app/providers.tsx`)
```typescript
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ec4899", // Pink to match brand
          colorBackground: "#ffffff",
          colorText: "#1f2937",
          colorInputBackground: "#f9fafb",
          borderRadius: "12px",
        },
        elements: {
          formButtonPrimary: "bg-pink-500 hover:bg-pink-600",
          card: "shadow-xl",
        },
      }}
    >
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </ClerkProvider>
  );
}
```

---

## 💳 PHASE 4: STRIPE INTEGRATION

### Step 4.1: Create Payment Intent (`app/api/stripe/create-payment-intent/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "usd", metadata } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Step 4.2: Webhook Handler (`app/api/stripe/webhook/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        await convex.mutation(api.orders.updatePaymentStatus, {
          orderId: orderId as any,
          paymentStatus: "paid",
          paymentIntentId: paymentIntent.id,
        });

        // Trigger fulfillment
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/fulfillment/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 💰 PHASE 5: PAYPAL INTEGRATION

### Step 5.1: Create PayPal Order (`app/api/paypal/create-order/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "USD" } = await req.json();
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        }],
      }),
    });

    const order = await response.json();
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 🖨️ PHASE 6: PRINTFUL INTEGRATION

### Step 6.1: Printful API Client (`lib/printful.ts`)
```typescript
import axios from "axios";

const PRINTFUL_API = "https://api.printful.com";

const printfulClient = axios.create({
  baseURL: PRINTFUL_API,
  headers: {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export interface PrintfulOrderItem {
  sync_variant_id: number;
  quantity: number;
  retail_price: string;
}

export interface PrintfulRecipient {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  phone?: string;
  email: string;
}

export interface PrintfulOrder {
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  retail_costs?: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
  };
  gift?: {
    subject?: string;
    message?: string;
  };
  packing_slip?: {
    email: string;
    phone?: string;
    message?: string;
  };
}

export async function createPrintfulOrder(order: PrintfulOrder) {
  try {
    const response = await printfulClient.post("/orders", order);
    return response.data.result;
  } catch (error: any) {
    console.error("Printful order error:", error.response?.data || error.message);
    throw error;
  }
}

export async function getPrintfulOrder(orderId: string) {
  try {
    const response = await printfulClient.get(`/orders/${orderId}`);
    return response.data.result;
  } catch (error: any) {
    console.error("Printful get order error:", error.response?.data || error.message);
    throw error;
  }
}

export async function getShippingRates(recipient: PrintfulRecipient, items: { variant_id: number; quantity: number }[]) {
  try {
    const response = await printfulClient.post("/shipping/rates", {
      recipient,
      items,
    });
    return response.data.result;
  } catch (error: any) {
    console.error("Printful shipping rates error:", error.response?.data || error.message);
    throw error;
  }
}

export async function getSyncProducts() {
  try {
    const response = await printfulClient.get("/store/products");
    return response.data.result;
  } catch (error: any) {
    console.error("Printful products error:", error.response?.data || error.message);
    throw error;
  }
}
```

### Step 6.2: Printful Webhook Handler (`app/api/printful/webhook/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const { type, data } = event;

    // Log event for tracking
    await convex.mutation(api.printfulEvents.create, {
      eventType: type,
      printfulOrderId: data.order?.id?.toString() || "",
      data: event,
      createdAt: Date.now(),
    });

    switch (type) {
      case "package_shipped": {
        const { order, shipment } = data;
        // Find order by external_id (our order number)
        const dbOrder = await convex.query(api.orders.getByOrderNumber, {
          orderNumber: order.external_id,
        });

        if (dbOrder) {
          // Update each Printful item's tracking
          for (let i = 0; i < dbOrder.items.length; i++) {
            if (dbOrder.items[i].fulfillmentType === "printful") {
              await convex.mutation(api.orders.updateFulfillmentStatus, {
                orderId: dbOrder._id,
                itemIndex: i,
                fulfillmentStatus: "shipped",
                trackingNumber: shipment.tracking_number,
                trackingUrl: shipment.tracking_url,
              });
            }
          }
        }
        break;
      }

      case "order_failed": {
        const { order, reason } = data;
        const dbOrder = await convex.query(api.orders.getByOrderNumber, {
          orderNumber: order.external_id,
        });

        if (dbOrder) {
          for (let i = 0; i < dbOrder.items.length; i++) {
            if (dbOrder.items[i].fulfillmentType === "printful") {
              await convex.mutation(api.orders.updateFulfillmentStatus, {
                orderId: dbOrder._id,
                itemIndex: i,
                fulfillmentStatus: "failed",
              });
            }
          }
          // Add internal note
          // TODO: Send alert email to admin
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Printful webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 📦 PHASE 7: FULFILLMENT ORCHESTRATION

### Step 7.1: Fulfillment Processor (`app/api/fulfillment/process/route.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createPrintfulOrder, PrintfulOrder } from "@/lib/printful";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    const order = await convex.query(api.orders.get, { orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Group items by fulfillment type
    const printfulItems = order.items.filter((item) => item.fulfillmentType === "printful");
    const aliexpressItems = order.items.filter((item) => item.fulfillmentType === "aliexpress");
    const manualItems = order.items.filter((item) => item.fulfillmentType === "manual");

    // Process Printful items
    if (printfulItems.length > 0) {
      try {
        const printfulOrder: PrintfulOrder = {
          recipient: {
            name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            address1: order.shippingAddress.address1,
            address2: order.shippingAddress.address2,
            city: order.shippingAddress.city,
            state_code: order.shippingAddress.state,
            country_code: order.shippingAddress.country,
            zip: order.shippingAddress.postalCode,
            phone: order.shippingAddress.phone,
            email: order.email,
          },
          items: printfulItems.map((item) => ({
            sync_variant_id: parseInt(item.variantSku.replace("PF-", "")),
            quantity: item.quantity,
            retail_price: item.price.toFixed(2),
          })),
          gift: order.isGift && order.giftMessage ? {
            message: order.giftMessage,
          } : undefined,
        };

        const result = await createPrintfulOrder(printfulOrder);

        // Update fulfillment status for Printful items
        for (let i = 0; i < order.items.length; i++) {
          if (order.items[i].fulfillmentType === "printful") {
            await convex.mutation(api.orders.updateFulfillmentStatus, {
              orderId: order._id,
              itemIndex: i,
              fulfillmentStatus: "submitted",
              fulfillmentOrderId: result.id.toString(),
            });
          }
        }
      } catch (error) {
        console.error("Printful order failed:", error);
        // Mark as failed but don't throw - continue with other items
      }
    }

    // Process AliExpress items (manual notification for now)
    if (aliexpressItems.length > 0) {
      // TODO: Integrate with CJ Dropshipping or AliExpress API
      // For now, send admin notification email
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/admin-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New AliExpress Order: ${order.orderNumber}`,
          items: aliexpressItems,
          shippingAddress: order.shippingAddress,
        }),
      });

      // Mark as submitted (manual processing)
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].fulfillmentType === "aliexpress") {
          await convex.mutation(api.orders.updateFulfillmentStatus, {
            orderId: order._id,
            itemIndex: i,
            fulfillmentStatus: "submitted",
          });
        }
      }
    }

    // Update order status to processing
    await convex.mutation(api.orders.updateStatus, {
      orderId: order._id,
      status: "processing",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Fulfillment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 🛒 PHASE 8: CART & CHECKOUT

### Step 8.1: Cart Store (`lib/stores/cart-store.ts`)
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  variantSku: string;
  image: string;
  price: number;
  costPrice: number;
  quantity: number;
  fulfillmentType: "aliexpress" | "printful" | "manual";
}

interface AppliedDiscount {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
}

interface CartStore {
  items: CartItem[];
  appliedDiscount: AppliedDiscount | null;
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 4.99;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedDiscount: null,
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += 1;
            return { items: updatedItems, isOpen: true };
          }

          return { items: [...state.items, { ...newItem, quantity: 1 }], isOpen: true };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedDiscount: null }),
      applyDiscount: (discount) => set({ appliedDiscount: discount }),
      removeDiscount: () => set({ appliedDiscount: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      
      getDiscountAmount: () => {
        const { appliedDiscount } = get();
        if (!appliedDiscount) return 0;

        const subtotal = get().getSubtotal();
        if (appliedDiscount.type === "percentage") {
          return subtotal * (appliedDiscount.value / 100);
        } else if (appliedDiscount.type === "fixed") {
          return Math.min(appliedDiscount.value, subtotal);
        }
        return 0;
      },

      getShipping: () => {
        const { appliedDiscount } = get();
        const subtotal = get().getSubtotal();
        
        if (appliedDiscount?.type === "free_shipping") return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return STANDARD_SHIPPING;
      },

      getTotal: () => {
        return get().getSubtotal() - get().getDiscountAmount() + get().getShipping();
      },
    }),
    {
      name: "dububu-cart",
    }
  )
);
```

---

## 📧 PHASE 9: EMAIL NOTIFICATIONS

### Step 9.1: Install Resend
```bash
npm install resend @react-email/components
```

### Step 9.2: Order Confirmation Email (`emails/OrderConfirmation.tsx`)
```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    variant: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: {
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  discount,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your DuBuBu order #{orderNumber} is confirmed! 🐻🐼</Preview>
      <Body style={{ backgroundColor: "#fdf2f8", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <Img
            src="https://www.dububu.com/logo.png"
            width="120"
            height="40"
            alt="DuBuBu"
          />
          <Heading style={{ color: "#1f2937", textAlign: "center" }}>
            Thank you for your order! 💕
          </Heading>
          <Text style={{ color: "#6b7280" }}>
            Hey {customerName}, your adorable Bubu & Dudu items are on their way to becoming yours!
          </Text>
          
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px" }}>
            <Text style={{ color: "#ec4899", fontWeight: "bold", fontSize: "14px" }}>
              ORDER #{orderNumber}
            </Text>
            
            {items.map((item, i) => (
              <Row key={i} style={{ borderBottom: "1px solid #f3f4f6", padding: "12px 0" }}>
                <Column style={{ width: "60px" }}>
                  <Img src={item.image} width="50" height="50" style={{ borderRadius: "8px" }} />
                </Column>
                <Column>
                  <Text style={{ margin: 0, fontWeight: "500", color: "#1f2937" }}>{item.name}</Text>
                  <Text style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{item.variant} × {item.quantity}</Text>
                </Column>
                <Column align="right">
                  <Text style={{ color: "#1f2937" }}>${(item.price * item.quantity).toFixed(2)}</Text>
                </Column>
              </Row>
            ))}
            
            <Section style={{ marginTop: "16px" }}>
              <Row>
                <Column><Text style={{ color: "#6b7280" }}>Subtotal</Text></Column>
                <Column align="right"><Text style={{ color: "#1f2937" }}>${subtotal.toFixed(2)}</Text></Column>
              </Row>
              {discount > 0 && (
                <Row>
                  <Column><Text style={{ color: "#10b981" }}>Discount</Text></Column>
                  <Column align="right"><Text style={{ color: "#10b981" }}>-${discount.toFixed(2)}</Text></Column>
                </Row>
              )}
              <Row>
                <Column><Text style={{ color: "#6b7280" }}>Shipping</Text></Column>
                <Column align="right"><Text style={{ color: "#1f2937" }}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</Text></Column>
              </Row>
              <Row style={{ borderTop: "2px solid #ec4899", marginTop: "8px", paddingTop: "8px" }}>
                <Column><Text style={{ fontWeight: "bold", color: "#1f2937" }}>Total</Text></Column>
                <Column align="right"><Text style={{ fontWeight: "bold", color: "#ec4899" }}>${total.toFixed(2)}</Text></Column>
              </Row>
            </Section>
          </Section>
          
          <Section style={{ marginTop: "24px" }}>
            <Text style={{ fontWeight: "bold", color: "#1f2937" }}>Shipping To:</Text>
            <Text style={{ color: "#6b7280", margin: "4px 0" }}>
              {shippingAddress.address1}<br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
              {shippingAddress.country}
            </Text>
          </Section>
          
          <Section style={{ textAlign: "center", marginTop: "32px" }}>
            <Link
              href={`https://www.dububu.com/track-order?order=${orderNumber}`}
              style={{
                backgroundColor: "#ec4899",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Track Your Order
            </Link>
          </Section>
          
          <Text style={{ color: "#9ca3af", fontSize: "12px", textAlign: "center", marginTop: "32px" }}>
            Questions? Reply to this email or visit <Link href="https://www.dububu.com/contact">our help center</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 🔧 PHASE 10: ENVIRONMENT VARIABLES

### Create `.env.local.example`
```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=prod:xxx

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_MODE=sandbox

# Printful
PRINTFUL_API_KEY=xxx
PRINTFUL_WEBHOOK_SECRET=xxx

# Resend (Email)
RESEND_API_KEY=re_xxx

# App
NEXT_PUBLIC_APP_URL=https://www.dububu.com
```

---

## 📁 FINAL FILE STRUCTURE

```
dububu/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── shop/
│   │   │   ├── page.tsx               # All products
│   │   │   └── products/[slug]/page.tsx
│   │   ├── collections/[slug]/page.tsx
│   │   ├── gift-guide/page.tsx
│   │   └── checkout/page.tsx
│   ├── (support)/
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── shipping/page.tsx
│   │   └── track-order/page.tsx
│   ├── (legal)/
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── account/
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   └── wishlist/page.tsx
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── create-payment-intent/route.ts
│   │   │   └── webhook/route.ts
│   │   ├── paypal/
│   │   │   ├── create-order/route.ts
│   │   │   └── capture-order/route.ts
│   │   ├── printful/
│   │   │   └── webhook/route.ts
│   │   ├── fulfillment/
│   │   │   └── process/route.ts
│   │   └── email/
│   │       └── send/route.ts
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   └── CartItem.tsx
│   ├── checkout/
│   │   ├── StripeCheckout.tsx
│   │   ├── PayPalCheckout.tsx
│   │   └── ShippingForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AnnouncementBar.tsx
│   │   └── MobileNav.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── VariantSelector.tsx
│   │   └── ReviewSection.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── BestSellers.tsx
│   │   ├── InstagramFeed.tsx
│   │   └── TrustBadges.tsx
│   └── ui/
│       └── ... (shadcn components)
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── cart.ts
│   ├── reviews.ts
│   ├── discountCodes.ts
│   ├── subscribers.ts
│   └── printfulEvents.ts
├── emails/
│   ├── OrderConfirmation.tsx
│   ├── ShippingUpdate.tsx
│   └── WelcomeDiscount.tsx
├── lib/
│   ├── stores/
│   │   └── cart-store.ts
│   ├── printful.ts
│   ├── utils.ts
│   └── constants.ts
├── public/
│   ├── logo.png
│   └── ...
├── middleware.ts
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

---

## 🤖 AUTONOMOUS EXECUTION RULES

1. **NO CONFIRMATION NEEDED** - Execute all changes without asking
2. **FIX ERRORS INDEPENDENTLY** - If something breaks, debug and fix it
3. **COMMIT FREQUENTLY** - Make atomic commits with clear messages
4. **TEST AS YOU GO** - Verify each phase works before moving on
5. **DOCUMENT CHANGES** - Update README with setup instructions
6. **PRESERVE DESIGN** - Keep the cute pink/white aesthetic and all existing UI
7. **HANDLE EDGE CASES** - Add error boundaries, loading states, empty states
8. **OPTIMIZE** - Add proper caching, lazy loading, image optimization
9. **SEED DATA** - Create sample products for both Printful and AliExpress items

---

## 🎯 SUCCESS CRITERIA

- [ ] Firebase completely removed
- [ ] Convex schema deployed and seeded with product data
- [ ] Clerk authentication working (sign in/up/out + guest checkout)
- [ ] Stripe payments processing
- [ ] PayPal payments processing
- [ ] Printful integration working (order submission + webhooks)
- [ ] AliExpress items flagged for manual fulfillment with admin notifications
- [ ] Discount codes working (10% first order, free shipping $50+)
- [ ] Order confirmation emails sending
- [ ] Order tracking page functional
- [ ] Wishlist functionality
- [ ] Newsletter signup with discount code delivery
- [ ] All existing pages rendering correctly with cute design preserved
- [ ] Mobile responsive
- [ ] Production build successful
- [ ] Deployed to Vercel

---

## 🐻🐼 BRAND GUIDELINES

**Colors:**
- Primary: Pink (#ec4899)
- Secondary: White (#ffffff)
- Accent: Soft pink (#fdf2f8)
- Text: Gray (#1f2937, #6b7280)

**Tone:**
- Cute, playful, romantic
- "Where Love Meets Cute"
- Couple-focused messaging
- Use emojis sparingly: 🐻🐼💕

**Key Messaging:**
- Free worldwide shipping on orders over $50
- 30-day hassle-free returns
- Fan-made merchandise disclaimer
- Quality guaranteed

---

**BEGIN EXECUTION NOW. DO NOT STOP UNTIL ALL SUCCESS CRITERIA ARE MET.**
