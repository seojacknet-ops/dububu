import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("discountCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
  },
});

export const validate = query({
  args: {
    code: v.string(),
    email: v.optional(v.string()),
    subtotal: v.number(),
  },
  handler: async (ctx, args) => {
    const discountCode = await ctx.db
      .query("discountCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!discountCode) {
      return { valid: false, error: "Invalid discount code" };
    }

    const now = Date.now();

    if (!discountCode.isActive) {
      return { valid: false, error: "This discount code is no longer active" };
    }

    if (now < discountCode.validFrom) {
      return { valid: false, error: "This discount code is not yet active" };
    }

    if (now > discountCode.validUntil) {
      return { valid: false, error: "This discount code has expired" };
    }

    if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
      return { valid: false, error: "This discount code has reached its usage limit" };
    }

    if (discountCode.minPurchase && args.subtotal < discountCode.minPurchase) {
      return {
        valid: false,
        error: `Minimum purchase of $${discountCode.minPurchase.toFixed(2)} required`,
      };
    }

    if (discountCode.isFirstOrderOnly && args.email) {
      // Check if email has used this code
      if (discountCode.usedByEmails.includes(args.email)) {
        return { valid: false, error: "This discount code is for first orders only" };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discountCode.type === "percentage") {
      discountAmount = args.subtotal * (discountCode.value / 100);
    } else if (discountCode.type === "fixed") {
      discountAmount = Math.min(discountCode.value, args.subtotal);
    } else if (discountCode.type === "free_shipping") {
      discountAmount = 0; // Handled separately
    }

    return {
      valid: true,
      discountCode: {
        code: discountCode.code,
        type: discountCode.type,
        value: discountCode.value,
        discountAmount,
      },
    };
  },
});

export const use = mutation({
  args: {
    code: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const discountCode = await ctx.db
      .query("discountCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!discountCode) {
      throw new Error("Discount code not found");
    }

    await ctx.db.patch(discountCode._id, {
      usedCount: discountCode.usedCount + 1,
      usedByEmails: [...discountCode.usedByEmails, args.email],
    });
  },
});

export const create = mutation({
  args: {
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
    validFrom: v.number(),
    validUntil: v.number(),
    isFirstOrderOnly: v.optional(v.boolean()),
    applicableCategories: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("discountCodes", {
      code: args.code.toUpperCase(),
      type: args.type,
      value: args.value,
      minPurchase: args.minPurchase,
      maxUses: args.maxUses,
      usedCount: 0,
      usedByEmails: [],
      validFrom: args.validFrom,
      validUntil: args.validUntil,
      isActive: true,
      isFirstOrderOnly: args.isFirstOrderOnly ?? false,
      applicableCategories: args.applicableCategories,
    });
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("discountCodes").collect();
  },
});

export const deactivate = mutation({
  args: { id: v.id("discountCodes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false });
  },
});
