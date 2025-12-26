# Claude AI Assistant Guide
## DuBuBu.com - Next.js E-commerce Development

---

## 1. Overview

This guide covers using **Claude** (Anthropic's AI assistant) for developing the DuBuBu.com dropshipping store. Claude excels at code generation, debugging, content creation, and architectural decisions.

**Best Use Cases:**
- Writing React/Next.js components
- Database schema design
- API route implementation
- TypeScript type definitions
- Content generation (product descriptions, copy)
- Code review and debugging
- Architecture decisions
- Documentation

---

## 2. Project Context

When starting a conversation with Claude about this project, provide this context:

```
I'm building DuBuBu.com, a dropshipping e-commerce store selling Bubu & Dudu merchandise (cute bear and panda couple characters).

Tech Stack:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Stripe payments
- Printful (print-on-demand)
- Zustand (state management)
- Deployed on Vercel

Target audience: Young couples, kawaii enthusiasts, gift buyers
Brand vibe: Cute, warm, romantic, playful
```

---

## 3. Code Generation Prompts

### 3.1 Component Generation

**Product Card:**
```
Create a Next.js ProductCard component for DuBuBu.com with:
- Product image with hover effect (show GIF on hover)
- Product name and price
- Sale price support (show original crossed out)
- "Add to Cart" button
- Wishlist heart icon
- Use Tailwind CSS
- TypeScript with proper types
- Framer Motion for animations
```

**Shopping Cart Drawer:**
```
Create a cart drawer component for DuBuBu.com using:
- Radix UI Dialog as base
- Slides in from right
- Shows cart items with quantity controls
- Subtotal calculation
- "Checkout" and "Continue Shopping" buttons
- Empty cart state with cute GIF
- Zustand for cart state
- TypeScript
- Tailwind CSS
- Framer Motion animations
```

**Checkout Form:**
```
Create a multi-step checkout form for DuBuBu.com:
- Step 1: Shipping information
- Step 2: Shipping method selection
- Step 3: Payment (Stripe Elements)
- Step 4: Order review
- Use react-hook-form with zod validation
- TypeScript
- Tailwind CSS
- Progress indicator
- Mobile responsive
```

### 3.2 API Routes

**Products API:**
```
Create Next.js API routes for products:
- GET /api/products - List all products with pagination, filtering, sorting
- GET /api/products/[slug] - Get single product with variants
- POST /api/products (admin) - Create product
- PATCH /api/products/[id] (admin) - Update product
- Use Prisma for database
- Include proper error handling
- TypeScript
- Zod validation
```

**Cart API:**
```
Create cart API routes:
- GET /api/cart - Get current cart
- POST /api/cart/items - Add item to cart
- PATCH /api/cart/items/[id] - Update quantity
- DELETE /api/cart/items/[id] - Remove item
- Support both authenticated users and guest carts (session-based)
- Use Prisma
- TypeScript
```

**Checkout API:**
```
Create checkout API with Stripe:
- POST /api/checkout/session - Create Stripe checkout session
- POST /api/webhooks/stripe - Handle Stripe webhooks
- Integrate with Printful for order fulfillment
- Save order to database
- Send confirmation email
- TypeScript with proper types
```

### 3.3 Database Queries

**Complex Queries:**
```
Write a Prisma query to get featured products with:
- First 8 featured products
- Include first image for each
- Include category names
- Include average rating from reviews
- Sort by newest first
- TypeScript
```

**Order with Relations:**
```
Write a Prisma query to get an order with all relations:
- Order items with product and variant details
- User information
- Shipping address
- Payment status
- Fulfillment status
- Include types
```

### 3.4 Hooks

**useCart Hook:**
```
Create a useCart hook for DuBuBu.com that:
- Uses Zustand store
- Provides: items, addItem, removeItem, updateQuantity, clearCart
- Calculates subtotal, itemCount
- Persists to localStorage
- Syncs with server for authenticated users
- TypeScript with proper types
```

**useProducts Hook:**
```
Create a useProducts hook with:
- SWR or React Query for data fetching
- Pagination support
- Filtering (category, price range, tags)
- Sorting options
- Search functionality
- Loading and error states
- TypeScript
```

---

## 4. Content Generation Prompts

### 4.1 Product Descriptions

**Template:**
```
Write a product description for DuBuBu.com:

Product: [PRODUCT NAME]
Category: [CATEGORY]
Price: $[PRICE]

Requirements:
- 150-200 words
- Open with emotional hook about love/couples
- Describe features and materials
- Explain why it's perfect for couples
- 4-5 bullet point features
- Call-to-action with urgency
- Tone: Warm, cute, playful, romantic
- Include 2-3 relevant emojis
```

**Batch Generation:**
```
Generate product descriptions for these 5 products:

1. Bubu Dudu Couple Plush Set - $34.99 - Plushies
2. Matching "His Bubu Her Dudu" Hoodies - $89.99 - Apparel
3. Bubu Dudu Night Light Lamp - $29.99 - Home
4. Couple Keychain Set - $14.99 - Accessories
5. Cozy Fleece Blanket - $49.99 - Home

Use the DuBuBu brand voice: warm, cute, romantic, playful.
Format each with: Name, Description (150 words), 5 Bullet Points
```

### 4.2 Marketing Copy

**Homepage Hero:**
```
Write 5 variations of hero section copy for DuBuBu.com homepage:
- Headline (under 10 words)
- Subheadline (under 25 words)
- CTA button text

Brand: Cute Bubu & Dudu merchandise for couples
Tone: Warm, romantic, playful
Include emojis where appropriate
```

**Email Subject Lines:**
```
Generate 20 email subject lines for DuBuBu.com:

Categories:
- Welcome series (5) - for new subscribers
- Abandoned cart (5) - recover lost sales
- Promotional (5) - sales and offers
- New arrivals (5) - new product launches

Requirements:
- Under 50 characters each
- Use emojis appropriately
- Create curiosity/urgency
- Reference Bubu & Dudu characters
- A/B test variations
```

**Collection Page Copy:**
```
Write collection page descriptions for DuBuBu.com:

1. "Matching Sets" - Couple items
2. "Cozy Home" - Blankets, pillows, decor
3. "Plushies & Toys" - Stuffed animals
4. "Accessories" - Keychains, phone cases, jewelry
5. "Gift Ideas" - Curated gift collections

Each should be 50-75 words, warm and inviting.
```

### 4.3 SEO Content

**Meta Descriptions:**
```
Write SEO meta descriptions for these DuBuBu.com pages:

1. Homepage
2. All Products page
3. Plushies collection
4. Matching Couples collection
5. About Us page

Requirements:
- 150-160 characters each
- Include primary keyword
- Compelling call-to-action
- Brand personality
```

**Blog Post Outlines:**
```
Create blog post outlines for DuBuBu.com's "Couples Corner" blog:

Topics:
1. "10 Cute Matching Gifts for You and Your Partner"
2. "The Story of Bubu and Dudu: How a Bear and Panda Became Internet Famous"
3. "5 Ways to Make Your Home Cozy as a Couple"
4. "Long Distance Relationship Gift Ideas"
5. "Anniversary Gift Guide by Year"

For each: Title, Meta description, 5-7 H2 headings, Word count target
```

---

## 5. Debugging & Problem Solving

### 5.1 Error Debugging

**Template:**
```
I'm getting this error in my Next.js DuBuBu.com project:

Error: [PASTE ERROR]

File: [FILE PATH]

Code:
```
[PASTE RELEVANT CODE]
```

What I was trying to do: [EXPLAIN]

Tech stack: Next.js 14, TypeScript, Prisma, Tailwind
```

### 5.2 Performance Issues

```
My DuBuBu.com product listing page is slow. Here's my current implementation:

[PASTE CODE]

Issues:
- Large bundle size
- Slow initial load
- Images not optimized

Please suggest optimizations for:
1. Code splitting
2. Image optimization
3. Data fetching strategy
4. Caching
```

### 5.3 TypeScript Errors

```
I'm getting TypeScript errors with my Prisma types:

Error: [PASTE ERROR]

Schema:
```prisma
[PASTE RELEVANT SCHEMA]
```

Code:
```typescript
[PASTE CODE]
```

How do I properly type this?
```

---

## 6. Architecture Decisions

### 6.1 Feature Planning

```
I need to implement [FEATURE] for DuBuBu.com.

Requirements:
- [LIST REQUIREMENTS]

Current stack: Next.js 14 App Router, Prisma, PostgreSQL, Stripe

Questions:
1. What's the best approach?
2. What components/files do I need?
3. Database schema changes?
4. API routes needed?
5. Third-party services to consider?

Please provide a detailed implementation plan.
```

### 6.2 Database Design

```
I need to add [FEATURE] to my database schema.

Current relevant models:
```prisma
[PASTE CURRENT SCHEMA]
```

New requirements:
- [LIST REQUIREMENTS]

Please suggest:
1. New models needed
2. Relationships
3. Indexes for performance
4. Migration strategy
```

### 6.3 State Management

```
I need help deciding state management for DuBuBu.com:

Current state needs:
- Shopping cart (persisted)
- User authentication state
- UI state (modals, drawers)
- Product filters
- Wishlist

Currently using: Zustand

Should I:
1. Keep everything in Zustand?
2. Use React Query for server state?
3. Use URL state for filters?
4. Something else?

Please recommend an architecture.
```

---

## 7. Code Review Prompts

### 7.1 Component Review

```
Please review this React component for DuBuBu.com:

```tsx
[PASTE COMPONENT]
```

Check for:
1. Performance issues
2. Accessibility
3. TypeScript best practices
4. React best practices
5. Potential bugs
6. Code organization
7. Tailwind CSS usage

Suggest improvements.
```

### 7.2 API Route Review

```
Review this Next.js API route:

```typescript
[PASTE API ROUTE]
```

Check for:
1. Security vulnerabilities
2. Error handling
3. Input validation
4. Performance
5. TypeScript types
6. Edge cases

Provide improved version.
```

### 7.3 Database Query Review

```
Review this Prisma query for performance:

```typescript
[PASTE QUERY]
```

Data context:
- Expected rows: [NUMBER]
- Called frequency: [HOW OFTEN]
- Current indexes: [LIST]

Suggest optimizations.
```

---

## 8. Project-Specific Templates

### 8.1 New Feature Template

```
## Feature: [FEATURE NAME]

### Context
Building for DuBuBu.com (Next.js 14, TypeScript, Prisma, Stripe, Tailwind)

### Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### Current Implementation
[Describe what exists or "None - new feature"]

### Questions
1. [Specific question]
2. [Specific question]

### Expected Output
- Component code
- API routes
- Database changes
- Types/interfaces
```

### 8.2 Bug Fix Template

```
## Bug Report

### Environment
- Next.js 14.x
- Node 18.x
- Windows 11

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Error Messages
```
[Paste errors]
```

### Relevant Code
```typescript
[Paste code]
```

### What I've Tried
- [Attempt 1]
- [Attempt 2]
```

### 8.3 Refactor Request Template

```
## Refactor Request

### Current Code
```typescript
[Paste current implementation]
```

### Issues with Current Code
1. [Issue 1]
2. [Issue 2]

### Goals
- [ ] Improve performance
- [ ] Better type safety
- [ ] Cleaner architecture
- [ ] Add feature: [FEATURE]

### Constraints
- Must maintain backward compatibility
- Cannot change: [CONSTRAINTS]
```

---

## 9. Workflow Integration

### 9.1 VS Code with Claude

**Using Claude in VS Code:**
1. Copy code selection
2. Open Claude (web or app)
3. Paste with context
4. Get response
5. Apply changes

**Recommended Extensions:**
- GitHub Copilot (for inline suggestions)
- Claude Dev (if available)
- Markdown Preview

### 9.2 Git Commit Messages

```
Generate a conventional commit message for these changes:

Files changed:
- components/cart/cart-drawer.tsx (new)
- components/cart/cart-item.tsx (new)
- stores/cart-store.ts (modified)
- app/api/cart/route.ts (new)

Changes made:
[Describe changes]

Format: type(scope): description
Types: feat, fix, docs, style, refactor, test, chore
```

### 9.3 PR Descriptions

```
Generate a pull request description for:

Branch: feature/shopping-cart
Target: main

Changes:
- [List of changes]

Include:
- Summary
- Changes made
- Testing done
- Screenshots needed
- Checklist
```

---

## 10. DuBuBu-Specific Prompts

### 10.1 Bubu & Dudu Content

```
Write content featuring Bubu (the brown bear) and Dudu (the white panda):

Context: [CONTEXT - e.g., "404 page", "empty cart", "order confirmation"]

Requirements:
- In-character for the cute couple
- [Bubu is playful, Dudu is calm]
- Include appropriate emotion
- Short and sweet (under 50 words)
- Suggest which GIF category to use (love, hug, sleep, cute, celebration)
```

### 10.2 Seasonal Content

```
Create seasonal content for DuBuBu.com:

Season/Holiday: [Valentine's Day / Christmas / etc.]

Need:
1. Homepage banner headline + subhead
2. Email subject line (5 variations)
3. Collection page description
4. Social media caption (Instagram)
5. Discount code name suggestion

Brand voice: Warm, cute, romantic, playful
```

### 10.3 Customer Communication

```
Write customer service response for DuBuBu.com:

Situation: [SITUATION]
- e.g., "Order delayed", "Wrong item received", "Refund request"

Requirements:
- Apologetic but positive
- On-brand (cute, warm)
- Clear next steps
- Reference Bubu & Dudu naturally
- Professional but friendly
```

---

## 11. Advanced Usage

### 11.1 Multi-File Generation

```
Generate the complete implementation for [FEATURE]:

Provide all files needed:
1. Components (with full code)
2. API routes
3. Types/interfaces
4. Hooks
5. Database schema changes
6. Tests (optional)

Format each file with:
// filepath: [path/to/file.tsx]
[code]
```

### 11.2 Migration Assistance

```
I need to migrate [FROM] to [TO] in my DuBuBu.com project.

Current implementation:
```typescript
[CURRENT CODE]
```

Migration requirements:
- [Requirement 1]
- [Requirement 2]

Please provide:
1. Step-by-step migration plan
2. New code
3. What to test
4. Rollback plan
```

### 11.3 Testing

```
Generate tests for this component/function:

```typescript
[CODE TO TEST]
```

Testing framework: Jest + React Testing Library
Include:
- Unit tests
- Integration tests
- Edge cases
- Accessibility tests
- Mock data
```

---

## 12. Best Practices

### 12.1 Prompt Engineering Tips

1. **Be Specific:** Include file paths, exact errors, and context
2. **Provide Examples:** Show what you want with sample output
3. **Set Constraints:** Mention tech stack, coding standards
4. **Ask for Explanations:** "Explain why" helps learning
5. **Iterate:** Refine prompts based on responses
6. **Break Down:** Split complex tasks into smaller prompts

### 12.2 Context Management

**For Long Conversations:**
```
Quick context refresh:
- Project: DuBuBu.com (Next.js 14 e-commerce)
- Current task: [CURRENT TASK]
- Last thing we did: [LAST THING]
- Now I need: [CURRENT NEED]
```

**Starting New Conversation:**
```
Continuing DuBuBu.com development:
- Stack: Next.js 14, TypeScript, Prisma, Tailwind, Stripe
- Current feature: [FEATURE]
- [Include any relevant code/schema]
```

### 12.3 Code Quality Standards

When asking for code, specify:
```
Please follow these standards:
- TypeScript strict mode
- ESLint + Prettier formatting
- Functional components with hooks
- Tailwind CSS (no inline styles)
- Proper error handling
- Loading states
- Accessibility (ARIA labels)
- Mobile-first responsive design
```

---

## 13. Quick Reference

### Common Prompts

| Task | Prompt Start |
|------|-------------|
| New Component | "Create a Next.js component for..." |
| API Route | "Create an API route that..." |
| Database Query | "Write a Prisma query to..." |
| Debug Error | "I'm getting this error: [ERROR]" |
| Refactor | "Refactor this code to..." |
| Explain | "Explain how [X] works in..." |
| Review | "Review this code for..." |
| Content | "Write [TYPE] copy for DuBuBu.com..." |

### Response Formatting

Ask Claude to format responses as:
- **Code blocks** with file paths
- **Step-by-step** numbered lists
- **Tables** for comparisons
- **Bullet points** for lists
- **Sections** with headers

### Follow-up Prompts

- "Can you add TypeScript types?"
- "Make it more performant"
- "Add error handling"
- "Include loading states"
- "Make it mobile responsive"
- "Add accessibility"
- "Explain this part: [SPECIFIC PART]"
- "What are the edge cases?"

---

## Document Info
**Version:** 1.0  
**Created:** December 2025  
**Project:** DuBuBu.com (Next.js E-commerce)  
**AI Assistant:** Claude (Anthropic)

---

*Use this guide to get the most out of Claude for DuBuBu.com development. Combine with project spec, Gemini guide, and media instructions for complete workflow.* 🤖💕
