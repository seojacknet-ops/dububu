import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    eventType: v.string(),
    orderId: v.optional(v.id("orders")),
    printfulOrderId: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("printfulEvents", {
      eventType: args.eventType,
      orderId: args.orderId,
      printfulOrderId: args.printfulOrderId,
      data: args.data,
      createdAt: Date.now(),
    });
  },
});

export const markProcessed = mutation({
  args: { eventId: v.id("printfulEvents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eventId, {
      processedAt: Date.now(),
    });
  },
});

export const getByPrintfulOrderId = query({
  args: { printfulOrderId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("printfulEvents")
      .withIndex("by_printfulOrderId", (q) => q.eq("printfulOrderId", args.printfulOrderId))
      .collect();
  },
});

export const getUnprocessed = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("printfulEvents").collect();
    return events.filter((e) => !e.processedAt).sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const events = await ctx.db.query("printfulEvents").collect();
    return events.sort((a, b) => b.createdAt - a.createdAt).slice(0, args.limit || 50);
  },
});
