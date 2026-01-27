import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getWithProducts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!wishlist) {
      return { productIds: [], products: [] };
    }

    const products = await Promise.all(
      wishlist.productIds.map((id) => ctx.db.get(id))
    );

    return {
      productIds: wishlist.productIds,
      products: products.filter((p) => p !== null && p.isActive),
    };
  },
});

export const addProduct = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!wishlist) {
      return await ctx.db.insert("wishlists", {
        userId: args.userId,
        productIds: [args.productId],
        updatedAt: Date.now(),
      });
    }

    if (wishlist.productIds.includes(args.productId)) {
      return wishlist._id;
    }

    await ctx.db.patch(wishlist._id, {
      productIds: [...wishlist.productIds, args.productId],
      updatedAt: Date.now(),
    });

    return wishlist._id;
  },
});

export const removeProduct = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!wishlist) {
      return;
    }

    await ctx.db.patch(wishlist._id, {
      productIds: wishlist.productIds.filter((id) => id !== args.productId),
      updatedAt: Date.now(),
    });
  },
});

export const toggle = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!wishlist) {
      await ctx.db.insert("wishlists", {
        userId: args.userId,
        productIds: [args.productId],
        updatedAt: Date.now(),
      });
      return { added: true };
    }

    const isInWishlist = wishlist.productIds.includes(args.productId);

    await ctx.db.patch(wishlist._id, {
      productIds: isInWishlist
        ? wishlist.productIds.filter((id) => id !== args.productId)
        : [...wishlist.productIds, args.productId],
      updatedAt: Date.now(),
    });

    return { added: !isInWishlist };
  },
});

export const isInWishlist = query({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db
      .query("wishlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return wishlist?.productIds.includes(args.productId) ?? false;
  },
});
