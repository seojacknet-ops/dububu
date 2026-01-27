import { mutation } from "./_generated/server";

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if already seeded
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return { message: "Database already seeded", count: existingProducts.length };
    }

    // Seed categories first
    const categories = [
      { name: "Plushies", slug: "plushies", description: "Adorable Bubu & Dudu plush toys", sortOrder: 0 },
      { name: "Apparel", slug: "apparel", description: "T-shirts, hoodies, and more", sortOrder: 1 },
      { name: "Accessories", slug: "accessories", description: "Keychains, phone cases, and cute add-ons", sortOrder: 2 },
      { name: "Gift Sets", slug: "gift-sets", description: "Perfect presents for your loved ones", sortOrder: 3 },
      { name: "Matching Sets", slug: "matching-sets", description: "Couple items to share the love", sortOrder: 4 },
      { name: "Mugs", slug: "mugs", description: "Start your day with cuteness", sortOrder: 5 },
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", {
        ...cat,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Seed products
    const products = [
      // Plushies (AliExpress dropship)
      {
        name: "Classic Bubu & Dudu Plush Set",
        slug: "classic-bubu-dudu-plush-set",
        description: "The original Bubu and Dudu plush toys that started it all! This adorable pair features the lovable brown bear Bubu and the sweet white panda Dudu in their classic poses. Made with super soft, huggable material that's perfect for cuddling. Each plush stands approximately 10 inches tall.",
        shortDescription: "The original adorable bear and panda couple",
        category: "plushies",
        basePrice: 34.99,
        compareAtPrice: 44.99,
        costPrice: 12.00,
        images: [
          "https://ae01.alicdn.com/kf/S8a5e9c88c5e14dd4b0a4c4e7e7d7e7e7.jpg",
          "https://ae01.alicdn.com/kf/S8a5e9c88c5e14dd4b0a4c4e7e7d7e7e8.jpg",
        ],
        thumbnailGif: "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
        variants: [
          { id: "v1", name: "Standard Set", sku: "AE-PLUSH-001", price: 34.99, costPrice: 12.00, stock: 100, options: {} },
          { id: "v2", name: "Large Set (15\")", sku: "AE-PLUSH-002", price: 49.99, costPrice: 18.00, stock: 50, options: { size: "Large" } },
        ],
        fulfillmentType: "aliexpress" as const,
        aliexpressProductId: "1005001234567890",
        aliexpressUrl: "https://www.aliexpress.com/item/1005001234567890.html",
        tags: ["plush", "bubu", "dudu", "couple", "gift", "cute", "bestseller"],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isActive: true,
        salesCount: 234,
        viewCount: 5678,
      },
      {
        name: "Sleepy Bubu Plush",
        slug: "sleepy-bubu-plush",
        description: "Catch some Z's with this adorable sleepy Bubu plush! Perfect for bedtime cuddles, this plush features Bubu in his pajamas with a cute sleep mask. Ultra-soft material that's perfect for hugging.",
        shortDescription: "Bubu ready for bedtime cuddles",
        category: "plushies",
        basePrice: 29.99,
        compareAtPrice: null,
        costPrice: 10.00,
        images: [
          "https://ae01.alicdn.com/kf/Sleepy-bubu-plush.jpg",
        ],
        thumbnailGif: "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp",
        variants: [
          { id: "v1", name: "Standard", sku: "AE-PLUSH-003", price: 29.99, costPrice: 10.00, stock: 75, options: {} },
        ],
        fulfillmentType: "aliexpress" as const,
        aliexpressProductId: "1005001234567891",
        tags: ["plush", "bubu", "sleep", "cute", "bedtime"],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isActive: true,
        salesCount: 89,
        viewCount: 1234,
      },
      // Apparel (Printful POD)
      {
        name: "Matching Couple Hoodies - Bubu & Dudu",
        slug: "matching-couple-hoodies-bubu-dudu",
        description: "Show your love with these adorable matching hoodies! One features Bubu and the other Dudu, perfect for couples who want to express their love in the cutest way possible. Made from premium cotton blend for ultimate comfort.",
        shortDescription: "His and hers matching hoodies",
        category: "apparel",
        basePrice: 59.99,
        compareAtPrice: 79.99,
        costPrice: 28.00,
        images: [
          "https://files.cdn.printful.com/files/hoodie-mockup.jpg",
        ],
        variants: [
          { id: "v1", name: "S/S Set", sku: "PF-HOOD-001-SS", price: 59.99, costPrice: 28.00, options: { size: "S" } },
          { id: "v2", name: "M/M Set", sku: "PF-HOOD-001-MM", price: 59.99, costPrice: 28.00, options: { size: "M" } },
          { id: "v3", name: "L/L Set", sku: "PF-HOOD-001-LL", price: 59.99, costPrice: 28.00, options: { size: "L" } },
          { id: "v4", name: "XL/XL Set", sku: "PF-HOOD-001-XLXL", price: 59.99, costPrice: 28.00, options: { size: "XL" } },
          { id: "v5", name: "S/M Set", sku: "PF-HOOD-001-SM", price: 59.99, costPrice: 28.00, options: { size: "S/M" } },
          { id: "v6", name: "M/L Set", sku: "PF-HOOD-001-ML", price: 59.99, costPrice: 28.00, options: { size: "M/L" } },
        ],
        fulfillmentType: "printful" as const,
        printfulProductId: "sync_12345",
        printfulSyncVariants: [
          { variantId: "v1", printfulVariantId: 100001 },
          { variantId: "v2", printfulVariantId: 100002 },
          { variantId: "v3", printfulVariantId: 100003 },
          { variantId: "v4", printfulVariantId: 100004 },
          { variantId: "v5", printfulVariantId: 100005 },
          { variantId: "v6", printfulVariantId: 100006 },
        ],
        tags: ["hoodie", "couple", "matching", "apparel", "gift", "bestseller"],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isActive: true,
        salesCount: 156,
        viewCount: 4321,
      },
      {
        name: "Bubu & Dudu Love T-Shirt",
        slug: "bubu-dudu-love-tshirt",
        description: "A cute t-shirt featuring Bubu and Dudu sharing a heart. Made from 100% premium cotton with a relaxed fit. Perfect for casual outings or lounging at home.",
        shortDescription: "Casual love tee with Bubu & Dudu",
        category: "apparel",
        basePrice: 24.99,
        compareAtPrice: null,
        costPrice: 12.00,
        images: [
          "https://files.cdn.printful.com/files/tshirt-mockup.jpg",
        ],
        variants: [
          { id: "v1", name: "White - S", sku: "PF-TEE-001-WS", price: 24.99, costPrice: 12.00, options: { size: "S", color: "White" } },
          { id: "v2", name: "White - M", sku: "PF-TEE-001-WM", price: 24.99, costPrice: 12.00, options: { size: "M", color: "White" } },
          { id: "v3", name: "White - L", sku: "PF-TEE-001-WL", price: 24.99, costPrice: 12.00, options: { size: "L", color: "White" } },
          { id: "v4", name: "Pink - S", sku: "PF-TEE-001-PS", price: 24.99, costPrice: 12.00, options: { size: "S", color: "Pink" } },
          { id: "v5", name: "Pink - M", sku: "PF-TEE-001-PM", price: 24.99, costPrice: 12.00, options: { size: "M", color: "Pink" } },
          { id: "v6", name: "Pink - L", sku: "PF-TEE-001-PL", price: 24.99, costPrice: 12.00, options: { size: "L", color: "Pink" } },
        ],
        fulfillmentType: "printful" as const,
        printfulProductId: "sync_12346",
        tags: ["tshirt", "love", "apparel", "casual"],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isActive: true,
        salesCount: 67,
        viewCount: 890,
      },
      // Accessories
      {
        name: "Cute Panda Keychain Set",
        slug: "cute-panda-keychain-set",
        description: "Take Bubu and Dudu everywhere you go with these adorable keychains! Set includes both characters in a mini plush form with metal keyring attachments. Perfect for bags, keys, or to share with your partner.",
        shortDescription: "Mini plush keychains of the duo",
        category: "accessories",
        basePrice: 12.99,
        compareAtPrice: 16.99,
        costPrice: 4.00,
        images: [
          "https://ae01.alicdn.com/kf/keychain-set.jpg",
        ],
        variants: [
          { id: "v1", name: "Both Characters", sku: "AE-KEY-001", price: 12.99, costPrice: 4.00, stock: 200, options: {} },
          { id: "v2", name: "Bubu Only", sku: "AE-KEY-002", price: 7.99, costPrice: 2.50, stock: 150, options: { style: "Bubu" } },
          { id: "v3", name: "Dudu Only", sku: "AE-KEY-003", price: 7.99, costPrice: 2.50, stock: 150, options: { style: "Dudu" } },
        ],
        fulfillmentType: "aliexpress" as const,
        aliexpressProductId: "1005001234567892",
        tags: ["keychain", "accessories", "mini", "cute", "gift"],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        isActive: true,
        salesCount: 445,
        viewCount: 3456,
      },
      // Mugs
      {
        name: "Love Story Mug Set",
        slug: "love-story-mug-set",
        description: "Start your mornings together with this adorable mug set! Features Bubu on one mug and Dudu on the other, and when placed together they form a heart. Made from high-quality ceramic, dishwasher and microwave safe.",
        shortDescription: "His and hers mugs that form a heart",
        category: "mugs",
        basePrice: 24.99,
        compareAtPrice: 29.99,
        costPrice: 10.00,
        images: [
          "https://files.cdn.printful.com/files/mug-mockup.jpg",
        ],
        variants: [
          { id: "v1", name: "11oz Set", sku: "PF-MUG-001-11", price: 24.99, costPrice: 10.00, options: { size: "11oz" } },
          { id: "v2", name: "15oz Set", sku: "PF-MUG-001-15", price: 29.99, costPrice: 12.00, options: { size: "15oz" } },
        ],
        fulfillmentType: "printful" as const,
        printfulProductId: "sync_12347",
        tags: ["mug", "couple", "kitchen", "gift", "bestseller"],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isActive: true,
        salesCount: 189,
        viewCount: 2345,
      },
      // Gift Sets
      {
        name: "Ultimate Bubu & Dudu Gift Box",
        slug: "ultimate-bubu-dudu-gift-box",
        description: "The perfect gift for any Bubu & Dudu fan! This premium gift box includes: Classic Plush Set, Matching Keychains, and a Love Story Mug Set. Everything comes beautifully packaged in our signature pink gift box.",
        shortDescription: "Everything they need in one box",
        category: "gift-sets",
        basePrice: 89.99,
        compareAtPrice: 109.99,
        costPrice: 35.00,
        images: [
          "https://dububu.com/gift-box-mockup.jpg",
        ],
        variants: [
          { id: "v1", name: "Standard Box", sku: "DB-GIFT-001", price: 89.99, costPrice: 35.00, stock: 25, options: {} },
        ],
        fulfillmentType: "manual" as const,
        tags: ["gift", "bundle", "premium", "bestseller", "value"],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isActive: true,
        salesCount: 34,
        viewCount: 987,
      },
      // Matching Sets
      {
        name: "Couple Phone Case Set",
        slug: "couple-phone-case-set",
        description: "Protect your phones in the cutest way! This set includes two phone cases - one with Bubu and one with Dudu. Available for most popular iPhone and Samsung models. Made from durable TPU with a matte finish.",
        shortDescription: "Matching phone protection for couples",
        category: "matching-sets",
        basePrice: 29.99,
        compareAtPrice: 39.99,
        costPrice: 8.00,
        images: [
          "https://ae01.alicdn.com/kf/phone-case-set.jpg",
        ],
        variants: [
          { id: "v1", name: "iPhone 15/15", sku: "AE-CASE-001-15", price: 29.99, costPrice: 8.00, stock: 50, options: { style: "iPhone 15" } },
          { id: "v2", name: "iPhone 14/14", sku: "AE-CASE-001-14", price: 29.99, costPrice: 8.00, stock: 50, options: { style: "iPhone 14" } },
          { id: "v3", name: "Samsung S24/S24", sku: "AE-CASE-001-S24", price: 29.99, costPrice: 8.00, stock: 40, options: { style: "Samsung S24" } },
        ],
        fulfillmentType: "aliexpress" as const,
        aliexpressProductId: "1005001234567893",
        tags: ["phone case", "couple", "matching", "accessories", "tech"],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isActive: true,
        salesCount: 78,
        viewCount: 1567,
      },
    ];

    // Insert all products
    for (const product of products) {
      await ctx.db.insert("products", {
        ...product,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Seed discount codes
    const oneYearFromNow = now + 365 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("discountCodes", {
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      maxUses: undefined,
      usedCount: 0,
      usedByEmails: [],
      validFrom: now,
      validUntil: oneYearFromNow,
      isActive: true,
      isFirstOrderOnly: true,
    });

    await ctx.db.insert("discountCodes", {
      code: "LOVE20",
      type: "percentage",
      value: 20,
      minPurchase: 50,
      maxUses: 100,
      usedCount: 0,
      usedByEmails: [],
      validFrom: now,
      validUntil: oneYearFromNow,
      isActive: true,
      isFirstOrderOnly: false,
    });

    await ctx.db.insert("discountCodes", {
      code: "FREESHIP",
      type: "free_shipping",
      value: 0,
      minPurchase: 30,
      usedCount: 0,
      usedByEmails: [],
      validFrom: now,
      validUntil: oneYearFromNow,
      isActive: true,
      isFirstOrderOnly: false,
    });

    return { message: "Database seeded successfully", productCount: products.length, categoryCount: categories.length };
  },
});
