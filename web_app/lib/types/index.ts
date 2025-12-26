// Product Types
export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    description: string;
    image: string;
    images: string[];
    category: ProductCategory;
    tags?: string[];
    variants?: ProductVariant[];
    inStock: boolean;
    featured?: boolean;
    createdAt?: string;
}

export type ProductCategory = 
    | 'plushies' 
    | 'apparel' 
    | 'accessories' 
    | 'home' 
    | 'gift-sets';

export interface ProductVariant {
    id: string;
    name: string;
    type: 'size' | 'color' | 'style';
    price?: number;
    inStock: boolean;
    image?: string;
}

// Cart Types
export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variantId?: string;
    variantName?: string;
}

// Order Types
export interface Order {
    id: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    status: OrderStatus;
    shippingAddress: ShippingAddress;
    billingAddress?: BillingAddress;
    customerEmail: string;
    createdAt: string;
}

export type OrderStatus = 
    | 'pending' 
    | 'processing' 
    | 'shipped' 
    | 'delivered' 
    | 'cancelled';

// Address Types
export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
}

export interface BillingAddress extends ShippingAddress {}

// Form Types
export interface CheckoutFormData {
    email: string;
    shipping: ShippingAddress;
    sameAsBilling: boolean;
    billing?: BillingAddress;
}

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface NewsletterFormData {
    email: string;
}

// Category for navigation/filtering
export interface Category {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    productCount?: number;
}

// Review Types
export interface Review {
    id: string;
    productId: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    verified: boolean;
}

// Promo Code Types
export interface PromoCode {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minPurchase?: number;
    maxUses?: number;
    usedCount: number;
    expiresAt?: string;
    active: boolean;
}
