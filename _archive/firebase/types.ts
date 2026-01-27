import { Timestamp, FieldValue } from 'firebase-admin/firestore';

// ==========================================
// ENUMS (stored as strings in Firestore)
// ==========================================

export type Role = 'CUSTOMER' | 'ADMIN';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type VendorType = 'PRINTFUL' | 'CJDROPSHIPPING' | 'ALIEXPRESS' | 'MANUAL';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type FulfillmentStatus = 'UNFULFILLED' | 'PARTIALLY_FULFILLED' | 'FULFILLED' | 'RETURNED';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
export type SubscriberStatus = 'ACTIVE' | 'UNSUBSCRIBED';
export type ContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';

// ==========================================
// USER & AUTHENTICATION
// ==========================================

export interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: Timestamp;
  image?: string;
  password?: string; // Hashed password for credentials auth
  role: Role;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ==========================================
// PRODUCTS
// ==========================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  trackInventory: boolean;
  quantity: number;
  lowStockAlert: number;
  weight?: number;
  status: ProductStatus;
  featured: boolean;
  vendorType?: VendorType;
  vendorId?: string;
  printfulSyncId?: string;
  metaTitle?: string;
  metaDescription?: string;
  // Denormalized for easier querying
  images: ProductImage[];
  categoryIds: string[];
  tagIds: string[];
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  inStock: boolean;
  optionType?: string;
  optionValue?: string;
  vendorVariantId?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ==========================================
// CATEGORIES & TAGS
// ==========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ==========================================
// CART
// ==========================================

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ==========================================
// ORDERS
// ==========================================

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  email: string;
  phone?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  // Denormalized order items for easier access
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  stripeChargeId?: string;
  vendorOrderId?: string;
  vendorType?: VendorType;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: Timestamp | FieldValue;
  deliveredAt?: Timestamp | FieldValue;
  discountCode?: string;
  notes?: string;
  customerNotes?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export interface BillingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  vendorItemId?: string;
}

// ==========================================
// REVIEWS
// ==========================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  content?: string;
  images: string[];
  verified: boolean;
  approved: boolean;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ==========================================
// WISHLIST
// ==========================================

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Timestamp | FieldValue;
}

// ==========================================
// DISCOUNTS
// ==========================================

export interface DiscountCode {
  id: string;
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  startsAt?: Timestamp;
  expiresAt?: Timestamp;
  active: boolean;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ==========================================
// NEWSLETTER
// ==========================================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  source?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ==========================================
// CONTACT SUBMISSIONS
// ==========================================

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

// ==========================================
// HELPER TYPES FOR CREATE/UPDATE
// ==========================================

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt'>>;

export type CreateProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProduct = Partial<Omit<Product, 'id' | 'createdAt'>>;

export type CreateOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateOrder = Partial<Omit<Order, 'id' | 'createdAt'>>;
