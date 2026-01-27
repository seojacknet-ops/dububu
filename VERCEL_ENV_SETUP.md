# Vercel Environment Variables Setup

The build is failing because required environment variables are missing. You need to add these in your Vercel project settings:

## Required Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

### Clerk Authentication (Required)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

Get your keys from: https://dashboard.clerk.com/last-active?path=api-keys

### Convex Database (Required)
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=prod:YOUR_KEY_HERE
```

Get these from: https://dashboard.convex.dev

### Stripe Payments (Required)
```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

Get these from: https://dashboard.stripe.com/apikeys

### PayPal (Required)
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_SECRET
PAYPAL_MODE=sandbox
```

Get these from: https://developer.paypal.com

### Email (Required)
```
RESEND_API_KEY=re_YOUR_KEY_HERE
```

Get from: https://resend.com/api-keys

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Steps to Deploy

1. Add all required environment variables in Vercel dashboard
2. Redeploy your application
3. The build should succeed

## Current Error

The error occurs because Clerk middleware is checking for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` during the build process for static page generation.
