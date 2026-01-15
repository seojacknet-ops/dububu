# DuBuBu.com - Bug Fixes & Improvements
## Developer Task Checklist

**Date:** December 2025  
**Priority:** High - These issues are blocking user experience  
**Source:** QA Agent Website Review

---

## 🚨 Critical Issues (Fix Immediately)

### 1. Broken Category Pages - 404 Errors

**Problem:** Clicking category links returns 404 errors. This is a major trust breaker.

**Affected Routes:**
- [ ] `/collections/plushies` → 404
- [ ] `/collections/apparel` → 404
- [ ] `/collections/accessories` → 404
- [ ] `/collections/gift-sets` → 404
- [ ] `/collections/matching-sets` → 404

**Solution:**
```
app/
└── collections/
    └── [slug]/
        └── page.tsx    ← Create this file
```

**Implementation:**
```typescript
// app/collections/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/features/products/queries'
import { ProductGrid } from '@/features/products/components/product-grid'

const VALID_SLUGS = ['plushies', 'apparel', 'accessories', 'gift-sets', 'matching-sets']

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }))
}

export default async function CollectionPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  if (!VALID_SLUGS.includes(params.slug)) {
    notFound()
  }

  const products = await getProductsByCategory(params.slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold capitalize mb-8">
        {params.slug.replace('-', ' ')}
      </h1>
      <ProductGrid products={products} />
    </div>
  )
}
```

**Checklist:**
- [x] Create `app/collections/[slug]/page.tsx`
- [x] Create `getProductsByCategory` query in `features/products/queries/`
- [x] Add loading.tsx for suspense
- [x] Add proper meta tags for SEO
- [ ] Test all category links from navigation
- [ ] Test all category links from homepage "Shop by Category"

---

### 2. Broken Track Order Page - 404 Error

**Problem:** Help section "Track Order" link leads to 404.

**Affected Route:**
- [ ] `/track-order` or `/account/orders` → 404

**Solution:**
```typescript
// app/(shop)/track-order/page.tsx
'use client'

import { useState } from 'react'
import { trackOrder } from '@/features/orders/actions/track-order'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await trackOrder({ orderNumber, email })
    if (res.success) {
      setResult(res.order)
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Order Number
          </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g., DBB-12345"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-love-pink text-white py-3 rounded-lg font-semibold hover:bg-blush transition"
        >
          Track Order
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}

      {result && (
        <div className="mt-8 p-4 bg-soft-pink rounded-lg">
          {/* Display order status, tracking info */}
        </div>
      )}
    </div>
  )
}
```

**Checklist:**
- [x] Create `app/(shop)/track-order/page.tsx`
- [x] Create `trackOrder` server action
- [x] Query order by orderNumber + email (security)
- [x] Display order status, items, tracking URL if available
- [x] Add link to this page in footer and help section
- [ ] Test with real order data

---

## 🔧 High Priority (This Sprint)

### 3. Missing Contact Form

**Problem:** Contact page only shows email, says form "coming soon". Customers need an easy way to reach out.

**Current State:** Email only (hello@dububu.com)

**Solution:**
```typescript
// app/(marketing)/contact/page.tsx
'use client'

import { useState, useTransition } from 'react'
import { submitContactForm } from '@/features/contact/actions/submit-form'

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await submitContactForm(formData)
      if (result.success) {
        setSubmitted(true)
      }
    })
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">💕</div>
        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
        <p className="text-gray-600">
          Bubu & Dudu received your message. We'll respond within 24-48 hours.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            name="subject"
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="general">General Inquiry</option>
            <option value="order">Order Question</option>
            <option value="return">Returns & Refunds</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-love-pink text-white py-3 rounded-lg font-semibold hover:bg-blush transition disabled:opacity-50"
        >
          {isPending ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className="mt-12 text-center text-gray-600">
        <p>Or email us directly:</p>
        <a href="mailto:hello@dububu.com" className="text-love-pink font-semibold">
          hello@dububu.com
        </a>
        <p className="mt-4">Follow us: @dububu.co</p>
      </div>
    </div>
  )
}
```

**Server Action:**
```typescript
// features/contact/actions/submit-form.ts
'use server'

import { z } from 'zod'
import { resend } from '@/lib/email/resend'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string(),
  message: z.string().min(10),
})

export async function submitContactForm(formData: FormData) {
  try {
    const data = schema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    })

    // Send email to admin
    await resend.emails.send({
      from: 'DuBuBu Contact <noreply@dububu.com>',
      to: 'hello@dububu.com',
      subject: `[Contact Form] ${data.subject} - ${data.name}`,
      text: `From: ${data.name} (${data.email})\n\n${data.message}`,
    })

    // Send confirmation to customer
    await resend.emails.send({
      from: 'DuBuBu <hello@dububu.com>',
      to: data.email,
      subject: 'We received your message! 💕',
      text: `Hi ${data.name},\n\nThank you for reaching out! We've received your message and will respond within 24-48 hours.\n\nLove,\nBubu & Dudu 🐻🐼`,
    })

    return { success: true }
  } catch (error) {
    console.error('[CONTACT_FORM]', error)
    return { success: false, error: 'Failed to send message' }
  }
}
```

**Checklist:**
- [x] Update `app/(marketing)/contact/page.tsx` with form
- [x] Create `features/contact/actions/submit-form.ts`
- [x] Set up Resend email integration
- [x] Create email templates (admin notification + customer confirmation)
- [x] Add form validation (Zod)
- [x] Add success/error states
- [ ] Test email delivery
- [x] Remove "coming soon" text

---

### 4. Gift Guide Links Not Working

**Problem:** Gift Guide categories link to general shop page instead of curated collections.

**Affected Links:**
- [ ] "For Your Partner" → Should filter couple items
- [ ] "Anniversary Gifts" → Should show anniversary collection
- [ ] "Valentine's Day" → Should show Valentine's collection
- [ ] "Birthday Gifts" → Should show birthday collection
- [ ] "Under $25" → Should filter by price
- [ ] "Matching Sets" → Should show matching items only

**Solution Options:**

**Option A: Query Parameters (Quick Fix)**
```typescript
// Link to: /products?occasion=anniversary
// Link to: /products?maxPrice=25
// Link to: /products?tag=matching
```

**Option B: Dedicated Collection Pages (Better)**
```
app/
└── gift-guide/
    ├── page.tsx              # Gift guide landing
    ├── for-partner/
    │   └── page.tsx
    ├── anniversary/
    │   └── page.tsx
    ├── valentines/
    │   └── page.tsx
    ├── birthday/
    │   └── page.tsx
    └── under-25/
        └── page.tsx
```

**Database: Add Tags/Occasions to Products**
```prisma
model Product {
  // ... existing fields
  occasions String[]  // ['anniversary', 'birthday', 'valentines']
  tags      String[]  // ['matching', 'couple', 'gift']
}
```

**Checklist:**
- [ ] Decide: Query params vs dedicated pages
- [ ] Add `occasions` and `tags` fields to Product model
- [ ] Tag existing products appropriately
- [ ] Create gift guide sub-pages or implement filtering
- [ ] Update gift guide page links
- [ ] Test each gift guide category

---

### 5. Search & Filter Functionality

**Problem:** Search icon exists but no robust filtering. Will become painful as catalog grows.

**Required Filters:**
- [ ] Category (Plushies, Apparel, etc.)
- [ ] Price range ($0-25, $25-50, $50+)
- [ ] Size (for apparel)
- [ ] Occasion (Anniversary, Valentine's, Birthday)
- [ ] Sort (Newest, Price Low-High, Price High-Low, Best Selling)

**Implementation:**
```typescript
// app/products/page.tsx
import { Suspense } from 'react'
import { ProductFilters } from '@/features/products/components/product-filters'
import { ProductGrid } from '@/features/products/components/product-grid'
import { getFilteredProducts } from '@/features/products/queries'

interface SearchParams {
  category?: string
  minPrice?: string
  maxPrice?: string
  size?: string
  occasion?: string
  sort?: string
  q?: string  // search query
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const products = await getFilteredProducts(searchParams)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 hidden lg:block">
          <ProductFilters currentFilters={searchParams} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
```

**Search Component:**
```typescript
// components/layout/search.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(`/products?q=${encodeURIComponent(query)}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </form>
  )
}
```

**Checklist:**
- [ ] Create `ProductFilters` component
- [ ] Create `getFilteredProducts` query with all filter options
- [ ] Implement URL-based state (searchParams)
- [ ] Add mobile filter drawer
- [ ] Add sort dropdown
- [ ] Create search functionality
- [ ] Add predictive search (optional, future)
- [ ] Test all filter combinations

---

## ⚠️ Medium Priority (Next Sprint)

### 6. Fan-Made Disclaimer Visibility

**Problem:** Disclaimer that products are fan-made is buried in FAQ. Could cause customer confusion about official licensing.

**Current Location:** FAQ page only

**Recommended Locations:**
- [ ] Footer (always visible)
- [ ] Product pages (near add to cart)
- [ ] Checkout page
- [ ] About page

**Implementation:**
```typescript
// components/layout/footer.tsx
<footer>
  {/* ... other footer content ... */}
  
  <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
    <p>
      DuBuBu is a fan-made merchandise store. We are not affiliated with 
      or endorsed by the original Bubu & Dudu creators.
    </p>
    <p className="mt-2">
      © {new Date().getFullYear()} DuBuBu. All rights reserved.
    </p>
  </div>
</footer>
```

```typescript
// On product pages, add near price/add-to-cart:
<p className="text-xs text-gray-500 mt-4">
  ℹ️ Fan-made merchandise. Not officially affiliated.
</p>
```

**Checklist:**
- [ ] Add disclaimer to footer
- [ ] Add small disclaimer on product pages
- [ ] Add disclaimer on checkout page
- [ ] Update About page with clear explanation
- [ ] Review FAQ wording

---

### 7. Accessibility Improvements

**Problems Identified:**
- Text may lack contrast on pastel backgrounds
- Alt-text missing on images
- Keyboard navigation not tested
- No ARIA labels on interactive elements

**Checklist:**
- [ ] Audit color contrast (use WebAIM contrast checker)
- [ ] Ensure all text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Add `alt` text to ALL images
  ```tsx
  <Image 
    src={product.image} 
    alt={`${product.name} - Bubu and Dudu ${product.category}`}
  />
  ```
- [ ] Test keyboard navigation (Tab through all interactive elements)
- [ ] Add ARIA labels to buttons without text
  ```tsx
  <button aria-label="Add to cart">
    <ShoppingCart />
  </button>
  ```
- [ ] Add `aria-live` regions for dynamic content (cart updates, etc.)
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Add skip-to-content link
- [ ] Ensure focus states are visible

**Contrast Fixes:**
```css
/* Ensure sufficient contrast */
.text-gray-600 {
  /* Check this passes contrast on pastel backgrounds */
}

/* Add focus-visible styles */
button:focus-visible,
a:focus-visible {
  @apply ring-2 ring-love-pink ring-offset-2 outline-none;
}
```

---

### 8. Trust & Security Signals

**Problem:** Missing visual trust signals that reassure customers.

**Add These Elements:**

**Payment Icons (Footer/Checkout):**
```typescript
// components/shared/payment-icons.tsx
import Image from 'next/image'

const PAYMENT_METHODS = [
  { name: 'Visa', icon: '/icons/visa.svg' },
  { name: 'Mastercard', icon: '/icons/mastercard.svg' },
  { name: 'American Express', icon: '/icons/amex.svg' },
  { name: 'Apple Pay', icon: '/icons/applepay.svg' },
  { name: 'Google Pay', icon: '/icons/googlepay.svg' },
]

export function PaymentIcons() {
  return (
    <div className="flex items-center gap-2">
      {PAYMENT_METHODS.map((method) => (
        <Image
          key={method.name}
          src={method.icon}
          alt={method.name}
          width={40}
          height={25}
        />
      ))}
    </div>
  )
}
```

**Security Badge:**
```typescript
// Near checkout button
<div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
  <Lock className="w-4 h-4" />
  <span>Secure checkout powered by Stripe</span>
</div>
```

**Customer Reviews (Future):**
- [ ] Add review system to product pages
- [ ] Display star ratings
- [ ] Show review count

**Checklist:**
- [ ] Add payment method icons to footer
- [ ] Add payment icons to checkout page
- [ ] Add "Secure checkout" badge with lock icon
- [ ] Add trust badges (Free Shipping, 30-Day Returns, Secure Payment)
- [ ] Plan customer review system (future sprint)

---

## 📋 Summary Checklist

### 🚨 Critical (Do First)
- [ ] Fix 404 on category pages (Plushies, Apparel, Accessories, etc.)
- [ ] Fix 404 on Track Order page
- [ ] Test all navigation links

### 🔧 High Priority (This Sprint)
- [ ] Add working contact form with email integration
- [ ] Fix Gift Guide links to show curated products
- [ ] Implement product filtering and search

### ⚠️ Medium Priority (Next Sprint)
- [ ] Add fan-made disclaimer to footer and product pages
- [ ] Complete accessibility audit and fixes
- [ ] Add payment icons and trust badges

### 📈 Future Enhancements
- [ ] Customer reviews/ratings
- [ ] Predictive search
- [ ] Wishlist functionality
- [ ] Order tracking integration with Printful
- [ ] Live chat support

---

## Testing Checklist

Before marking any task complete:

- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test keyboard navigation
- [ ] Verify no console errors
- [ ] Check loading states work
- [ ] Verify error states display correctly
- [ ] Test with slow network (throttle in DevTools)

---

## Notes

- **Current Product Count:** Limited catalog - prioritize quality over quantity
- **Stripe:** Already integrated and working
- **Email:** Using Resend - verify API key in `.env.local`
- **Brand Voice:** Keep all copy warm, cute, and romantic

**Questions? Contact:** hello@dububu.com

---

**Document Version:** 1.0  
**Created:** December 2025  
**Next Review:** After Critical Issues Fixed
