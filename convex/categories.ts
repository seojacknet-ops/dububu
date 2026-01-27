import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const categories = await ctx.db.query("categories").collect();

    const filtered = args.activeOnly !== false
      ? categories.filter((c) => c.isActive)
      : categories;

    return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get max sort order if not provided
    let sortOrder = args.sortOrder;
    if (sortOrder === undefined) {
      const categories = await ctx.db.query("categories").collect();
      sortOrder = categories.length > 0
        ? Math.max(...categories.map((c) => c.sortOrder)) + 1
        : 0;
    }

    return await ctx.db.insert("categories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      image: args.image,
      parentId: args.parentId,
      sortOrder,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getWithProductCount = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const products = await ctx.db.query("products").collect();

    const activeCategories = categories.filter((c) => c.isActive);

    return activeCategories
      .map((category) => ({
        ...category,
        productCount: products.filter((p) => p.isActive && p.category === category.slug).length,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});
