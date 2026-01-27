// This file is a stub for development/build purposes.
// Run `npx convex dev` to generate the actual implementation.

export const api = {
  products: {
    getAll: "products:getAll",
    getBySlug: "products:getBySlug",
    getBestSellers: "products:getBestSellers",
    getFeatured: "products:getFeatured",
    search: "products:search",
    getByCategory: "products:getByCategory",
    create: "products:create",
    update: "products:update",
    remove: "products:remove",
  },
  orders: {
    create: "orders:create",
    get: "orders:get",
    getByOrderNumber: "orders:getByOrderNumber",
    getByEmail: "orders:getByEmail",
    getByUserId: "orders:getByUserId",
    getAll: "orders:getAll",
    list: "orders:list",
    updatePaymentStatus: "orders:updatePaymentStatus",
    updateStatus: "orders:updateStatus",
    updateFulfillmentStatus: "orders:updateFulfillmentStatus",
    addInternalNote: "orders:addInternalNote",
    getRecentOrders: "orders:getRecentOrders",
    getOrderStats: "orders:getOrderStats",
  },
  cart: {
    get: "cart:get",
    getBySession: "cart:getBySession",
    addItem: "cart:addItem",
    updateItemQuantity: "cart:updateItemQuantity",
    removeItem: "cart:removeItem",
    applyDiscount: "cart:applyDiscount",
    removeDiscount: "cart:removeDiscount",
    clear: "cart:clear",
    merge: "cart:merge",
  },
  discountCodes: {
    validate: "discountCodes:validate",
    use: "discountCodes:use",
    create: "discountCodes:create",
  },
  subscribers: {
    subscribe: "subscribers:subscribe",
    getAll: "subscribers:getAll",
  },
  reviews: {
    getByProduct: "reviews:getByProduct",
    create: "reviews:create",
    getAll: "reviews:getAll",
  },
  contactMessages: {
    create: "contactMessages:create",
    getAll: "contactMessages:getAll",
  },
  wishlists: {
    get: "wishlists:get",
    add: "wishlists:add",
    remove: "wishlists:remove",
  },
  printfulEvents: {
    create: "printfulEvents:create",
    getByOrderId: "printfulEvents:getByOrderId",
  },
  categories: {
    getAll: "categories:getAll",
    getBySlug: "categories:getBySlug",
    create: "categories:create",
    update: "categories:update",
    remove: "categories:remove",
    getWithProductCount: "categories:getWithProductCount",
  },
  collections: {
    getAll: "collections:getAll",
    getBySlug: "collections:getBySlug",
    create: "collections:create",
    update: "collections:update",
    remove: "collections:remove",
  },
  seed: {
    seedProducts: "seed:seedProducts",
    clearProducts: "seed:clearProducts",
  },
};
