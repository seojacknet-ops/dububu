import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
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
      .collect();
  },
});

export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getAll = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("partially_shipped"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      const orders = await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
      return args.limit ? orders.slice(0, args.limit) : orders;
    }

    const orders = await ctx.db.query("orders").collect();
    // Sort by createdAt descending
    orders.sort((a, b) => b.createdAt - a.createdAt);
    return args.limit ? orders.slice(0, args.limit) : orders;
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
    const updates: Record<string, unknown> = {
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

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
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
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
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

export const addInternalNote = mutation({
  args: {
    orderId: v.id("orders"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const existingNotes = order.internalNotes || "";
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${args.note}`;

    await ctx.db.patch(args.orderId, {
      internalNotes: existingNotes ? `${existingNotes}\n${newNote}` : newNote,
      updatedAt: Date.now(),
    });
  },
});

export const getRecentOrders = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").collect();
    orders.sort((a, b) => b.createdAt - a.createdAt);
    return orders.slice(0, args.limit || 10);
  },
});

// Alias for admin panel
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").collect();
    orders.sort((a, b) => b.createdAt - a.createdAt);
    return args.limit ? orders.slice(0, args.limit) : orders;
  },
});

export const getOrderStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0);
    const totalProfit = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.profit, 0);
    const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "paid").length;

    return {
      totalOrders,
      totalRevenue,
      totalProfit,
      pendingOrders,
    };
  },
});
