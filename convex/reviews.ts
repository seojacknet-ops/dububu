import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByProduct = query({
  args: {
    productId: v.id("products"),
    approvedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    const filtered = args.approvedOnly !== false
      ? reviews.filter((r) => r.isApproved)
      : reviews;

    // Sort by newest first
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    productId: v.id("products"),
    orderId: v.optional(v.id("orders")),
    userId: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    rating: v.number(),
    title: v.string(),
    content: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Check if verified purchase
    let isVerifiedPurchase = false;
    if (args.orderId) {
      const order = await ctx.db.get(args.orderId);
      if (order && order.email === args.email && order.paymentStatus === "paid") {
        isVerifiedPurchase = true;
      }
    }

    return await ctx.db.insert("reviews", {
      productId: args.productId,
      orderId: args.orderId,
      userId: args.userId,
      name: args.name,
      email: args.email,
      rating: Math.min(5, Math.max(1, args.rating)),
      title: args.title,
      content: args.content,
      images: args.images,
      isVerifiedPurchase,
      isApproved: false, // Requires moderation
      helpful: 0,
      createdAt: Date.now(),
    });
  },
});

export const approve = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, { isApproved: true });
  },
});

export const reject = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reviewId);
  },
});

export const markHelpful = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    if (review) {
      await ctx.db.patch(args.reviewId, { helpful: review.helpful + 1 });
    }
  },
});

export const getAverageRating = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    const approvedReviews = reviews.filter((r) => r.isApproved);

    if (approvedReviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: Math.round((sum / approvedReviews.length) * 10) / 10,
      count: approvedReviews.length,
    };
  },
});

export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_approved", (q) => q.eq("isApproved", false))
      .collect();

    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  },
});
