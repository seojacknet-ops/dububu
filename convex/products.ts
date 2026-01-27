import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    onlyActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const onlyActive = args.onlyActive ?? true;

    if (args.category) {
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();

      const filtered = onlyActive
        ? products.filter((p) => p.isActive)
        : products;

      return args.limit ? filtered.slice(0, args.limit) : filtered;
    }

    const products = await ctx.db.query("products").collect();
    const filtered = onlyActive ? products.filter((p) => p.isActive) : products;
    return args.limit ? filtered.slice(0, args.limit) : filtered;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBestSellers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_bestSeller", (q) => q.eq("isBestSeller", true))
      .collect();

    const filtered = products.filter((p) => p.isActive);
    return filtered.slice(0, args.limit || 8);
  },
});

export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();

    const filtered = products.filter((p) => p.isActive);
    return args.limit ? filtered.slice(0, args.limit) : filtered;
  },
});

export const getNewArrivals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .collect();

    const filtered = products
      .filter((p) => p.isActive && p.isNewArrival)
      .sort((a, b) => b.createdAt - a.createdAt);

    return filtered.slice(0, args.limit || 8);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase();
    const products = await ctx.db
      .query("products")
      .collect();

    return products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.tags.some((t) => t.toLowerCase().includes(searchTerm)))
    );
  },
});

export const getByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.union(
      v.literal("price_asc"),
      v.literal("price_desc"),
      v.literal("newest"),
      v.literal("popular")
    )),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    let filtered = products.filter((p) => p.isActive);

    // Sort
    switch (args.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "popular":
        filtered.sort((a, b) => b.salesCount - a.salesCount);
        break;
    }

    return args.limit ? filtered.slice(0, args.limit) : filtered;
  },
});

export const incrementView = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (product) {
      await ctx.db.patch(args.productId, {
        viewCount: product.viewCount + 1,
      });
    }
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    category: v.string(),
    subcategory: v.optional(v.string()),
    basePrice: v.number(),
    compareAtPrice: v.optional(v.number()),
    costPrice: v.number(),
    images: v.array(v.string()),
    thumbnailGif: v.optional(v.string()),
    variants: v.array(v.object({
      id: v.string(),
      name: v.string(),
      sku: v.string(),
      price: v.number(),
      costPrice: v.number(),
      stock: v.optional(v.number()),
      image: v.optional(v.string()),
      options: v.object({
        size: v.optional(v.string()),
        color: v.optional(v.string()),
        style: v.optional(v.string()),
      }),
    })),
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
    tags: v.array(v.string()),
    isFeatured: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("products", {
      ...args,
      isFeatured: args.isFeatured ?? false,
      isBestSeller: args.isBestSeller ?? false,
      isNewArrival: args.isNewArrival ?? true,
      isActive: args.isActive ?? true,
      salesCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    basePrice: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    costPrice: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    thumbnailGif: v.optional(v.string()),
    variants: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      sku: v.string(),
      price: v.number(),
      costPrice: v.number(),
      stock: v.optional(v.number()),
      image: v.optional(v.string()),
      options: v.object({
        size: v.optional(v.string()),
        color: v.optional(v.string()),
        style: v.optional(v.string()),
      }),
    }))),
    fulfillmentType: v.optional(v.union(
      v.literal("aliexpress"),
      v.literal("printful"),
      v.literal("manual")
    )),
    tags: v.optional(v.array(v.string())),
    isFeatured: v.optional(v.boolean()),
    isBestSeller: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
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
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
