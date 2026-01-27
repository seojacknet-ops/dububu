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
    .index("by_bestSeller", ["isBestSeller"])
    .index("by_active", ["isActive"]),

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
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_userId", ["userId"]),

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

  // Categories
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    sortOrder: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentId"]),
});
