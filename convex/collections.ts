import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const collections = await ctx.db.query("collections").collect();

    const filtered = args.activeOnly !== false
      ? collections.filter((c) => c.isActive)
      : collections;

    return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getBySlugWithProducts = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const collection = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!collection) {
      return null;
    }

    const products = await Promise.all(
      collection.productIds.map((id) => ctx.db.get(id))
    );

    return {
      ...collection,
      products: products.filter((p) => p !== null && p.isActive),
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    image: v.string(),
    productIds: v.optional(v.array(v.id("products"))),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get max sort order if not provided
    let sortOrder = args.sortOrder;
    if (sortOrder === undefined) {
      const collections = await ctx.db.query("collections").collect();
      sortOrder = collections.length > 0
        ? Math.max(...collections.map((c) => c.sortOrder)) + 1
        : 0;
    }

    return await ctx.db.insert("collections", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      image: args.image,
      productIds: args.productIds || [],
      isActive: true,
      sortOrder,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("collections"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    productIds: v.optional(v.array(v.id("products"))),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const addProduct = mutation({
  args: {
    collectionId: v.id("collections"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    if (collection.productIds.includes(args.productId)) {
      return;
    }

    await ctx.db.patch(args.collectionId, {
      productIds: [...collection.productIds, args.productId],
    });
  },
});

export const removeProduct = mutation({
  args: {
    collectionId: v.id("collections"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    await ctx.db.patch(args.collectionId, {
      productIds: collection.productIds.filter((id) => id !== args.productId),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
