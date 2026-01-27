import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    orderNumber: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      name: args.name,
      email: args.email,
      orderNumber: args.orderNumber,
      subject: args.subject,
      message: args.message,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const getAll = query({
  args: {
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("resolved")
    )),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("contactMessages")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }

    const messages = await ctx.db.query("contactMessages").collect();
    return messages.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("contactMessages"),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("resolved")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("contactMessages")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .collect();
    return messages.length;
  },
});
