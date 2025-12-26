# DuBuBu.com - AI Development Context

## Project Overview
E-commerce dropshipping store for Bubu & Dudu merchandise (cute bear and panda couple characters). Target audience: young couples, kawaii enthusiasts, gift buyers. Brand voice: warm, cute, romantic, playful.

## Architecture
- Frontend: React 19, server components default
- Backend: Next.js 15 App Router, server actions for mutations
- Database: PostgreSQL via Neon + Prisma ORM
- State: Zustand for client state (cart, UI)
- Auth: NextAuth.js v5
- Payments: Stripe Checkout + Webhooks
- Email: Resend + React Email
- Fulfillment: Printful API (print-on-demand)
- Hosting: Vercel
- Styling: Tailwind CSS + Framer Motion

## Code Style
- Files: kebab-case (`product-card.tsx`)
- Variables: camelCase (`cartItems`)
- Types/Interfaces: PascalCase (`ProductWithVariants`)
- React: Functional components with hooks (no classes)
- Database: Queries in server components, mutations in server actions
- TypeScript: Strict mode, no `any` except escape valves
- Components: Colocate with feature when specific, `/components/ui` for shared

## Project Structure
```
app/
├── (shop)/                     # Public store routes
│   ├── page.tsx               # Homepage
│   ├── products/[slug]/       # Product pages
│   ├── collections/[slug]/    # Collection pages
│   ├── cart/                  # Cart page
│   └── checkout/              # Checkout flow
├── (account)/                  # Auth-protected routes
│   └── account/               # User dashboard
├── api/
│   └── webhooks/              # Stripe, Printful webhooks
└── admin/                      # Admin dashboard (future)

features/
├── cart/
│   ├── actions/               # Server actions
│   ├── components/            # Cart-specific components
│   ├── hooks/                 # useCart, etc.
│   └── types.ts
├── checkout/
│   ├── actions/
│   └── components/
├── products/
│   ├── actions/
│   ├── components/
│   └── queries/               # Data fetching
└── orders/
    ├── actions/
    └── types.ts

components/
├── ui/                        # Shared UI (button, input, modal)
├── layout/                    # Header, footer, nav
└── marketing/                 # Homepage sections

lib/
├── db.ts                      # Prisma client
├── stripe.ts                  # Stripe client
├── printful.ts                # Printful API client
├── utils.ts                   # Helpers (cn, formatPrice)
└── constants/
    └── gifs.ts                # Tenor GIF URLs

stores/
├── cart-store.ts              # Zustand cart
└── ui-store.ts                # Modals, drawers state
```

## Key Patterns

### Server Actions
```typescript
// features/cart/actions/add-to-cart.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1)
})

export async function addToCart(input: z.infer<typeof schema>) {
  try {
    const validated = schema.parse(input)
    // ... database mutation
    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    console.error('[ADD_TO_CART]', error)
    return { success: false, error: 'Failed to add item' }
  }
}
```

### Data Fetching (Server Components)
```typescript
// features/products/queries/get-products.ts
import { db } from '@/lib/db'
import { cache } from 'react'

export const getProducts = cache(async (options?: {
  category?: string
  limit?: number
}) => {
  return db.product.findMany({
    where: {
      status: 'ACTIVE',
      ...(options?.category && {
        categories: { some: { category: { slug: options.category } } }
      })
    },
    include: {
      images: { take: 1 },
      variants: true
    },
    take: options?.limit ?? 20
  })
})
```

### Client Components
```typescript
// features/cart/components/add-to-cart-button.tsx
'use client'

import { useTransition } from 'react'
import { addToCart } from '../actions/add-to-cart'
import { useCartStore } from '@/stores/cart-store'

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const openCart = useCartStore((s) => s.openCart)

  const handleClick = () => {
    startTransition(async () => {
      const result = await addToCart({ productId, quantity: 1 })
      if (result.success) openCart()
    })
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
```

### Error Handling
```typescript
// Generic user messages, detailed logging
try {
  await riskyOperation()
} catch (error) {
  console.error('[OPERATION_NAME]', { error, context: { userId, productId } })
  return { error: 'Something went wrong. Please try again.' }
}
```

### Zustand Store
```typescript
// stores/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'dububu-cart' }
  )
)
```

## Important Constraints
- No browser APIs in server components (no `localStorage`, `window`, `document`)
- No large dependencies in server components (mark with `'use client'`)
- Always `revalidatePath()` or `revalidateTag()` after mutations
- Never expose API keys to client (use server actions/API routes)
- Images: Always use `next/image` with proper `width`/`height` or `fill`
- GIFs: Use `unoptimized` prop for animated GIFs
- Forms: Use `react-hook-form` + `zod` for validation
- Loading states: Use `useTransition` for server actions, Suspense for data

## Database Schema (Key Models)
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  price       Decimal  @db.Decimal(10, 2)
  status      ProductStatus @default(DRAFT)
  images      ProductImage[]
  variants    ProductVariant[]
  categories  CategoriesOnProducts[]
}

model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique
  sessionId String?    @unique
  items     CartItem[]
}

model Order {
  id              String   @id @default(cuid())
  orderNumber     String   @unique
  status          OrderStatus
  stripePaymentId String?
  printfulOrderId String?
  items           OrderItem[]
}
```

## Third-Party Integration

### Stripe
```typescript
// lib/stripe.ts
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Webhook handler: app/api/webhooks/stripe/route.ts
// Events: checkout.session.completed, payment_intent.succeeded
```

### Printful
```typescript
// lib/printful.ts
const PRINTFUL_API = 'https://api.printful.com'

export async function createPrintfulOrder(order: Order) {
  const res = await fetch(`${PRINTFUL_API}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transformOrderToPrintful(order))
  })
  return res.json()
}
```

### Tenor GIFs
```typescript
// lib/constants/gifs.ts
export const GIFS = {
  love: 'https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif',
  hug: 'https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif',
  sleep: 'https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp',
  sad: 'https://media.tenor.com/FCH04yiJT7IAAAAm/bubu-dudu-sseeyall.webp',
  celebrate: 'https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp',
} as const
```

## Environment Variables
```env
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

PRINTFUL_API_KEY="..."
RESEND_API_KEY="re_..."

# Optional
FAL_KEY="..."           # Image generation
TENOR_API_KEY="..."     # GIF API
```

## Testing
- Framework: Vitest + React Testing Library
- Coverage target: 80%+
- Test files: `*.test.ts(x)` colocated with source
- Run: `npm test` | `npm run test:coverage`

```typescript
// features/cart/actions/add-to-cart.test.ts
import { describe, it, expect, vi } from 'vitest'
import { addToCart } from './add-to-cart'

describe('addToCart', () => {
  it('validates input', async () => {
    const result = await addToCart({ productId: '', quantity: 0 })
    expect(result.success).toBe(false)
  })
})
```

## Common Commands
```powershell
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production

# Database
npx prisma studio        # Database GUI
npx prisma db push       # Push schema changes
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate client

# Testing
npm test                 # Run tests
npm run test:coverage    # With coverage

# Deployment
vercel                   # Deploy to Vercel
```

## Brand Guidelines (for content generation)
- **Bubu**: Brown teddy bear, playful, mischievous, energetic
- **Dudu**: White panda, calm, gentle, patient, wise
- **Tone**: Warm, cute, romantic, playful
- **Emojis**: Use sparingly (💕 🐻 🐼 ✨)
- **Colors**: Brown (#8B6F47), Pink (#FFB6C1), Cream (#F5E6D3)