# DuBuBu Migration Audit: Firebase to Convex

## Migration Date: 2026-01-26

## Current Firebase Usage

### Files Using Firebase

1. **lib/firebase/admin.ts** - Firebase Admin SDK initialization
2. **lib/firebase/client.ts** - Firebase Client SDK initialization
3. **lib/firebase/types.ts** - TypeScript type definitions
4. **lib/firebase/index.ts** - Re-exports
5. **lib/db.ts** - Database operations wrapper (Prisma-like API over Firestore)
6. **lib/auth.ts** - NextAuth with Firebase
7. **lib/vendors/fulfillment.ts** - Order fulfillment (uses db.ts)
8. **app/admin/orders/page.tsx** - Admin orders page
9. **scripts/seed-firebase.ts** - Database seeding script

### Current Data Models (from lib/firebase/types.ts)

- **User** - Authentication and user data
- **Product** - Products with variants
- **Category** - Product categories
- **Tag** - Product tags
- **Order** - Customer orders
- **OrderItem** - Order line items
- **DiscountCode** - Promotional codes
- **NewsletterSubscriber** - Email subscribers
- **ContactSubmission** - Contact form entries

### Current Collections (from lib/firebase/admin.ts)

```
USERS, PRODUCTS, CATEGORIES, TAGS, ORDERS, ORDER_ITEMS,
CARTS, CART_ITEMS, REVIEWS, WISHLISTS, ADDRESSES,
DISCOUNT_CODES, NEWSLETTER_SUBSCRIBERS, CONTACT_SUBMISSIONS
```

### Current Environment Variables

Firebase-related:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY`

## Migration Plan

### Phase 1: Remove Firebase
- [x] Audit Firebase usage
- [ ] Remove firebase & firebase-admin packages
- [ ] Delete lib/firebase/ directory

### Phase 2: Install New Stack
- [ ] Install Convex
- [ ] Install Clerk
- [ ] Install PayPal SDK
- [ ] Update Stripe integration

### Phase 3: Database Migration
- [ ] Create Convex schema
- [ ] Create Convex functions (products, orders, cart, etc.)
- [ ] Replace lib/db.ts with Convex queries
- [ ] Migrate seed data

### Phase 4: Authentication
- [ ] Replace NextAuth with Clerk
- [ ] Update middleware
- [ ] Update auth-protected routes

### Phase 5: Payments
- [ ] Update Stripe integration
- [ ] Add PayPal integration

### Phase 6: Fulfillment
- [ ] Update Printful integration
- [ ] Setup fulfillment orchestration

### Phase 7: Testing & Deployment
- [ ] Test all flows
- [ ] Update environment variables
- [ ] Deploy to Vercel
