# DuBuBu Production Setup Guide

Hey Jack! Here's everything you need to do to get the site production-ready.

## What Changed

The codebase was migrated from Firebase to a new stack:
- **Convex** - Real-time database (replaces Firestore)
- **Clerk** - Authentication (replaces Firebase Auth + NextAuth)
- **Stripe** - Payment processing with webhooks
- **PayPal** - Alternative payment option
- **Printful** - Print-on-demand fulfillment
- **Resend** - Transactional emails

Old Firebase files are archived in `_archive/` folder.

---

## Step 1: Set Up Convex

Convex is the database. You need to create a project and deploy the schema.

1. Create account at https://convex.dev
2. Run in terminal:
   ```bash
   npx convex dev
   ```
3. Follow the prompts to create a new project
4. This will generate `NEXT_PUBLIC_CONVEX_URL` and populate `.env.local`

The schema is already defined in `convex/schema.ts`. Running `convex dev` will deploy it.

---

## Step 2: Set Up Clerk

Clerk handles authentication (login, signup, user management).

1. Create account at https://clerk.com
2. Create a new application
3. Get your keys from Dashboard > API Keys
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
   CLERK_SECRET_KEY=sk_live_xxxxx
   ```

### Configure Clerk Settings
In Clerk Dashboard:
- **Allowed redirect URLs**: Add your production domain
- **Sign-in/Sign-up**: Enable Email + Google (optional)
- **User metadata**: For admin users, add `role: "admin"` to publicMetadata

---

## Step 3: Set Up Stripe

Stripe handles credit card payments.

1. Go to https://dashboard.stripe.com
2. Get keys from Developers > API Keys
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   ```

### Set Up Webhook
1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the webhook signing secret
5. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## Step 4: Set Up PayPal

PayPal is an alternative payment method.

1. Go to https://developer.paypal.com
2. Create an app in Dashboard
3. Get Client ID and Secret
4. Add to `.env.local`:
   ```
   PAYPAL_CLIENT_ID=xxxxx
   PAYPAL_CLIENT_SECRET=xxxxx
   ```

For production, make sure you're using LIVE credentials, not sandbox.

---

## Step 5: Set Up Printful

Printful handles print-on-demand product fulfillment.

1. Go to https://www.printful.com/dashboard
2. Go to Settings > API
3. Create an API key
4. Add to `.env.local`:
   ```
   PRINTFUL_API_KEY=xxxxx
   ```

### Set Up Webhook
1. In Printful Dashboard > Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/printful/webhook`
3. Enable events:
   - Package shipped
   - Order created
   - Order updated
   - Order failed/canceled

---

## Step 6: Set Up Resend (Email)

Resend sends transactional emails (order confirmations, etc).

1. Go to https://resend.com
2. Create account and verify your domain
3. Get API key from API Keys section
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxx
   ```

### Domain Verification
Add DNS records as instructed by Resend to send from your domain.

---

## Step 7: Environment Variables Summary

Your `.env.local` should have:

```bash
# Convex (auto-populated by npx convex dev)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# PayPal
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx

# Printful
PRINTFUL_API_KEY=xxxxx

# Resend
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=https://www.dububu.com
```

---

## Step 8: Deploy to Vercel

1. Push to GitHub (already done)
2. Import project in Vercel
3. Add all environment variables in Vercel Dashboard > Settings > Environment Variables
4. Deploy

### Important Vercel Settings
- Framework: Next.js (auto-detected)
- Build command: `npm run build`
- Node version: 18.x or higher

---

## Step 9: Post-Deploy Checklist

- [ ] Test checkout flow with Stripe test mode first
- [ ] Test PayPal checkout
- [ ] Verify Clerk login/signup works
- [ ] Check webhook endpoints are receiving events
- [ ] Send a test order email
- [ ] Set up a Printful test product and order
- [ ] Switch Stripe/PayPal to live mode when ready

---

## Admin Access

To make yourself an admin:

1. Sign up on the site
2. Go to Clerk Dashboard > Users
3. Find your user
4. Click Edit > Metadata
5. Add to Public metadata:
   ```json
   {
     "role": "admin"
   }
   ```
6. Alternatively, any email ending in `@dububu.com` gets admin access automatically

Admin dashboard is at: `/admin`

---

## Troubleshooting

### Build fails with Convex errors
Run `npx convex dev` first to generate the types.

### Clerk auth not working
Make sure both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set.

### Payments not processing
Check Stripe Dashboard for error logs. Verify webhook secret is correct.

### Emails not sending
Verify domain in Resend. Check API key is correct.

---

## Questions?

The code is documented. Key files:
- `convex/schema.ts` - Database schema
- `app/api/` - All API endpoints
- `app/providers.tsx` - Auth + database providers
- `middleware.ts` - Route protection

Let me know if you need anything else!
