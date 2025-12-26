import { Product } from '@/lib/types';

export const products: Product[] = [
    {
        id: "1",
        name: "Classic Bubu & Dudu Plush Set",
        slug: "classic-plush-set",
        price: 34.99,
        description: "The original Bubu & Dudu plushie set that started it all! These high-quality, ultra-soft plushies are perfect for cuddling. Bubu (the bear) and Dudu (the panda) are inseparable, just like you and your partner. Makes the perfect gift for anniversaries, Valentine's Day, or just because.",
        image: "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
        images: [
            "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
            "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp",
            "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp"
        ],
        category: "plushies",
        tags: ["plush", "couple", "gift", "bestseller"],
        inStock: true,
        featured: true,
    },
    {
        id: "2",
        name: "Matching Couple Hoodies",
        slug: "matching-hoodies",
        price: 59.99,
        compareAtPrice: 79.99,
        description: "Stay warm and cozy together with these adorable matching hoodies. Featuring Bubu on one and Dudu on the other, they complete each other when you stand next to your partner. Made from premium cotton blend for maximum comfort.",
        image: "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
        images: [
            "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
            "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp"
        ],
        category: "apparel",
        tags: ["hoodie", "couple", "matching", "sale"],
        variants: [
            { id: "v1", name: "S", type: "size", inStock: true },
            { id: "v2", name: "M", type: "size", inStock: true },
            { id: "v3", name: "L", type: "size", inStock: true },
            { id: "v4", name: "XL", type: "size", inStock: false },
        ],
        inStock: true,
        featured: true,
    },
    {
        id: "3",
        name: "Love Story Mug Set",
        slug: "love-story-mugs",
        price: 24.99,
        description: "Start your mornings together with these adorable Bubu & Dudu mugs. The set includes two 11oz ceramic mugs with cute designs that complement each other perfectly. Microwave and dishwasher safe.",
        image: "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp",
        images: [
            "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp",
            "https://media.tenor.com/JcPATwwdUOQAAAAm/bubu-dudu-sseeyall.webp"
        ],
        category: "home",
        tags: ["mug", "couple", "kitchen", "gift"],
        inStock: true,
        featured: true,
    },
    {
        id: "4",
        name: "Cute Panda Keychain",
        slug: "panda-keychain",
        price: 12.99,
        description: "Take Dudu with you wherever you go! This adorable panda keychain is made from high-quality acrylic with a durable metal ring. Perfect for keys, bags, or backpacks.",
        image: "https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp",
        images: [
            "https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp"
        ],
        category: "accessories",
        tags: ["keychain", "panda", "accessory"],
        inStock: true,
        featured: true,
    },
    {
        id: "5",
        name: "Panda Pajama Set",
        slug: "panda-pajamas",
        price: 45.99,
        description: "Get cozy for bedtime with this super soft panda-themed pajama set. Features an all-over print of sleepy Bubu & Dudu. Made from breathable cotton blend for comfortable sleep.",
        image: "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp",
        images: [
            "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp",
            "https://media.tenor.com/oPHqTKxUDo4AAAAm/bubu-dudu-sleep-funny-bubu-dudu-love.webp"
        ],
        category: "apparel",
        tags: ["pajamas", "sleep", "couple"],
        variants: [
            { id: "v1", name: "S", type: "size", inStock: true },
            { id: "v2", name: "M", type: "size", inStock: true },
            { id: "v3", name: "L", type: "size", inStock: true },
        ],
        inStock: true,
    },
    {
        id: "6",
        name: "Heart Pillow",
        slug: "heart-pillow",
        price: 29.99,
        description: "A cuddly heart-shaped pillow featuring Bubu & Dudu hugging. Perfect for decorating your bedroom or couch. Made with super soft plush material.",
        image: "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
        images: [
            "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
            "https://media.tenor.com/skrULsl5twcAAAAm/bubududukiwi-twitter.webp"
        ],
        category: "home",
        tags: ["pillow", "decor", "bedroom", "gift"],
        inStock: true,
    },
    {
        id: "7",
        name: "Couple T-Shirts Set",
        slug: "couple-tshirts",
        price: 39.99,
        description: "Show your love with these matching couple t-shirts! Bubu on one, Dudu on the other - together you complete the picture. 100% cotton, pre-shrunk.",
        image: "https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp",
        images: [
            "https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp"
        ],
        category: "apparel",
        tags: ["tshirt", "couple", "matching"],
        variants: [
            { id: "v1", name: "S", type: "size", inStock: true },
            { id: "v2", name: "M", type: "size", inStock: true },
            { id: "v3", name: "L", type: "size", inStock: true },
            { id: "v4", name: "XL", type: "size", inStock: true },
        ],
        inStock: true,
    },
    {
        id: "8",
        name: "Phone Case Duo",
        slug: "phone-case-duo",
        price: 19.99,
        description: "Protect your phone in style with these matching phone cases. Available for most iPhone and Samsung models. Hard shell with glossy finish.",
        image: "https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp",
        images: [
            "https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp"
        ],
        category: "accessories",
        tags: ["phone", "case", "tech", "couple"],
        inStock: true,
    },
    {
        id: "9",
        name: "Cozy Fleece Blanket",
        slug: "fleece-blanket",
        price: 49.99,
        description: "Wrap yourselves in love with this ultra-soft fleece blanket. Features an adorable Bubu & Dudu design. Perfect for movie nights and cuddle sessions. Size: 50\" x 60\".",
        image: "https://media.tenor.com/qQNt-BqDtE8AAAAm/bubu-fun-sleep-bubu-dudu-love.webp",
        images: [
            "https://media.tenor.com/qQNt-BqDtE8AAAAm/bubu-fun-sleep-bubu-dudu-love.webp"
        ],
        category: "home",
        tags: ["blanket", "cozy", "bedroom", "gift"],
        inStock: true,
    },
    {
        id: "10",
        name: "Bear Keychain",
        slug: "bear-keychain",
        price: 12.99,
        description: "Bring Bubu with you everywhere! This cute bear keychain matches perfectly with the Panda Keychain. Made from high-quality acrylic with a durable metal ring.",
        image: "https://media.tenor.com/cwNYjFIdTZ4AAAAm/bubu-cute-bubu-dudu.webp",
        images: [
            "https://media.tenor.com/cwNYjFIdTZ4AAAAm/bubu-cute-bubu-dudu.webp"
        ],
        category: "accessories",
        tags: ["keychain", "bear", "accessory"],
        inStock: true,
    },
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
    return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

export function getFeaturedProducts(): Product[] {
    return products.filter(p => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
    return products.filter(p => p.category === category);
}

export function searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery) ||
        p.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
    const product = getProductById(productId);
    if (!product) return [];
    
    return products
        .filter(p => p.id !== productId && p.category === product.category)
        .slice(0, limit);
}
