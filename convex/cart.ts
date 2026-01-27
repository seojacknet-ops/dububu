import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    sessionId: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query("carts")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
    }

    if (args.sessionId) {
      return await ctx.db
        .query("carts")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
        .first();
    }

    return null;
  },
});

export const getOrCreate = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try to find existing cart
    let cart = null;

    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();
    }

    if (!cart) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
        .first();
    }

    // Create if not exists
    if (!cart) {
      const cartId = await ctx.db.insert("carts", {
        sessionId: args.sessionId,
        userId: args.userId,
        items: [],
        updatedAt: Date.now(),
      });
      return await ctx.db.get(cartId);
    }

    // Update userId if logging in
    if (args.userId && !cart.userId) {
      await ctx.db.patch(cart._id, { userId: args.userId });
    }

    return cart;
  },
});

export const addItem = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    productId: v.id("products"),
    variantId: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    // Get or create cart
    let cart = args.userId
      ? await ctx.db.query("carts").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first()
      : await ctx.db.query("carts").withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId)).first();

    if (!cart) {
      const cartId = await ctx.db.insert("carts", {
        sessionId: args.sessionId,
        userId: args.userId,
        items: [{
          productId: args.productId,
          variantId: args.variantId,
          quantity: args.quantity,
        }],
        updatedAt: Date.now(),
      });
      return await ctx.db.get(cartId);
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === args.productId && item.variantId === args.variantId
    );

    let updatedItems;
    if (existingItemIndex > -1) {
      updatedItems = [...cart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + args.quantity,
      };
    } else {
      updatedItems = [
        ...cart.items,
        {
          productId: args.productId,
          variantId: args.variantId,
          quantity: args.quantity,
        },
      ];
    }

    await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(cart._id);
  },
});

export const updateItemQuantity = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    productId: v.id("products"),
    variantId: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const cart = args.userId
      ? await ctx.db.query("carts").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first()
      : await ctx.db.query("carts").withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId)).first();

    if (!cart) {
      throw new Error("Cart not found");
    }

    let updatedItems;
    if (args.quantity <= 0) {
      // Remove item
      updatedItems = cart.items.filter(
        (item) => !(item.productId === args.productId && item.variantId === args.variantId)
      );
    } else {
      // Update quantity
      updatedItems = cart.items.map((item) =>
        item.productId === args.productId && item.variantId === args.variantId
          ? { ...item, quantity: args.quantity }
          : item
      );
    }

    await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(cart._id);
  },
});

export const removeItem = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    productId: v.id("products"),
    variantId: v.string(),
  },
  handler: async (ctx, args) => {
    const cart = args.userId
      ? await ctx.db.query("carts").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first()
      : await ctx.db.query("carts").withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId)).first();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedItems = cart.items.filter(
      (item) => !(item.productId === args.productId && item.variantId === args.variantId)
    );

    await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(cart._id);
  },
});

export const applyDiscount = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const cart = args.userId
      ? await ctx.db.query("carts").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first()
      : await ctx.db.query("carts").withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId)).first();

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Find discount code
    const discountCode = await ctx.db
      .query("discountCodes")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!discountCode) {
      throw new Error("Invalid discount code");
    }

    // Validate discount code
    const now = Date.now();
    if (!discountCode.isActive) {
      throw new Error("This discount code is no longer active");
    }
    if (now < discountCode.validFrom || now > discountCode.validUntil) {
      throw new Error("This discount code has expired");
    }
    if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
      throw new Error("This discount code has reached its usage limit");
    }

    await ctx.db.patch(cart._id, {
      appliedDiscount: {
        code: discountCode.code,
        type: discountCode.type,
        value: discountCode.value,
      },
      updatedAt: Date.now(),
    });

    return await ctx.db.get(cart._id);
  },
});

export const removeDiscount = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cart = args.userId
      ? await ctx.db.query("carts").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first()
      : await ctx.db.query("carts").withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId)).first();

    if (!cart) {
      throw new Error("Cart not found");
    }

    await ctx.db.patch(cart._id, {
      appliedDiscount: undefined,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(cart._id);
  },
});

export const clear = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cart = args.userId
      ? await ctx.db.query("carts").withIndex("by_userId", (q) => q.eq("userId", args.userId)).first()
      : await ctx.db.query("carts").withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId)).first();

    if (!cart) {
      return;
    }

    await ctx.db.patch(cart._id, {
      items: [],
      appliedDiscount: undefined,
      updatedAt: Date.now(),
    });
  },
});

export const mergeGuestCart = mutation({
  args: {
    sessionId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get guest cart
    const guestCart = await ctx.db
      .query("carts")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    // Get user cart
    const userCart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!guestCart) {
      return userCart;
    }

    if (!userCart) {
      // Assign guest cart to user
      await ctx.db.patch(guestCart._id, {
        userId: args.userId,
        updatedAt: Date.now(),
      });
      return await ctx.db.get(guestCart._id);
    }

    // Merge items
    const mergedItems = [...userCart.items];
    for (const guestItem of guestCart.items) {
      const existingIndex = mergedItems.findIndex(
        (item) => item.productId === guestItem.productId && item.variantId === guestItem.variantId
      );
      if (existingIndex > -1) {
        mergedItems[existingIndex].quantity += guestItem.quantity;
      } else {
        mergedItems.push(guestItem);
      }
    }

    // Update user cart
    await ctx.db.patch(userCart._id, {
      items: mergedItems,
      updatedAt: Date.now(),
    });

    // Delete guest cart
    await ctx.db.delete(guestCart._id);

    return await ctx.db.get(userCart._id);
  },
});
