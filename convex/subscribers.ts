import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already subscribed
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      // Reactivate if inactive
      if (!existing.isActive) {
        await ctx.db.patch(existing._id, {
          isActive: true,
          firstName: args.firstName || existing.firstName,
        });
      }
      return existing._id;
    }

    return await ctx.db.insert("subscribers", {
      email: args.email.toLowerCase(),
      firstName: args.firstName,
      source: args.source,
      subscribedAt: Date.now(),
      isActive: true,
    });
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (subscriber) {
      await ctx.db.patch(subscriber._id, { isActive: false });
    }
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
  },
});

export const getAll = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const subscribers = await ctx.db.query("subscribers").collect();
    if (args.activeOnly) {
      return subscribers.filter((s) => s.isActive);
    }
    return subscribers;
  },
});

export const updateDiscountCodeSent = mutation({
  args: {
    email: v.string(),
    discountCode: v.string(),
  },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (subscriber) {
      await ctx.db.patch(subscriber._id, {
        discountCodeSent: args.discountCode,
      });
    }
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db.query("subscribers").collect();
    const active = subscribers.filter((s) => s.isActive);

    const bySource = active.reduce((acc, s) => {
      acc[s.source] = (acc[s.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: subscribers.length,
      active: active.length,
      bySource,
    };
  },
});
