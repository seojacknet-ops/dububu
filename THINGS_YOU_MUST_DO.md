# THINGS YOU MUST DO - DuBuBu Setup Checklist

This document lists all the manual steps required to make your DuBuBu store fully operational.

---

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Fill in .env.local with your API keys (see sections below)

# 4. Seed the database (after setting up Firebase)
npm run db:seed

# 5. Run development server
npm run dev
```

---

## Required Setup Steps

### 1. Firebase Setup (Required)

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and give it a name (e.g., "dububu-store")
3. Enable Google Analytics if desired (optional)
4. Click "Create project"

#### Enable Firestore Database
1. In your Firebase project, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Choose a location (select closest to your users)
4. Start in "Production mode" (you'll set up security rules later)
5. Click "Enable"

#### Get Firebase Configuration
1. Go to Project Settings (gear icon) > "General"
2. Scroll down to "Your apps" and click the web icon (`</>`)
3. Register your app with a nickname (e.g., "dububu-web")
4. Copy the configuration values to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"
   ```

#### Create Service Account (for server-side operations)
1. Go to Project Settings > "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the ENTIRE content of the JSON file and add it to `.env.local` as a single line:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
   ```

**Important:** Keep the service account key secure and never commit it to version control!

#### Set Up Firestore Security Rules
1. Go to "Firestore Database" > "Rules"
2. Replace with these basic rules (adjust for production):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to products, categories, tags
       match /products/{document=**} {
         allow read: if true;
         allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
       }
       match /categories/{document=**} {
         allow read: if true;
         allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
       }
       match /tags/{document=**} {
         allow read: if true;
         allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
       }

       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }

       // Orders are restricted to owner or admin
       match /orders/{orderId} {
         allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN');
         allow create: if true; // Webhooks need to create orders
         allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
       }

       // Discount codes readable by all, writable by admin
       match /discountCodes/{document=**} {
         allow read: if true;
         allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
       }

       // Contact submissions
       match /contactSubmissions/{document=**} {
         allow create: if true;
         allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
       }

       // Newsletter subscribers
       match /newsletterSubscribers/{document=**} {
         allow create: if true;
         allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
       }
     }
   }
   ```

**After Firebase setup:**
```bash
npm run db:seed    # Seed with initial data
```

---

### 2. Authentication Setup

#### Generate NextAuth Secret
```bash
# Generate a random secret
openssl rand -base64 32
```

Add to `.env.local`:
```
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

//////I AM UP TO THIS PART//// JACK!!!
#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`:
   ```
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

---

### 3. Stripe Payment Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account if needed (or use Test Mode)

#### Get API Keys
1. Go to Developers > API keys
2. Copy keys to `.env.local`:
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

#### Set Up Webhook (Required for order processing)
1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL:
   - Local: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for testing
   - Production: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy webhook signing secret:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

#### Local Testing with Stripe CLI
```bash
# Install Stripe CLI
# Then run:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

### 4. Email Setup (Resend)

1. Go to [resend.com](https://resend.com) and create account
2. Verify your domain (or use resend.dev for testing)
3. Go to API Keys and create new key
4. Add to `.env.local`:
   ```
   RESEND_API_KEY="re_..."
   ```

**Important:** For production, verify your domain to send from your email address.

---

### 5. Vendor Integration Setup

#### Printful (Print-on-Demand)
1. Go to [printful.com](https://www.printful.com) and create account
2. Go to Dashboard > Developer > Apps
3. Create new app and get API key
4. Add to `.env.local`:
   ```
   PRINTFUL_API_KEY="..."
   ```
5. Create products in Printful dashboard
6. Link Printful product IDs to your Firestore products

#### CJDropshipping
1. Go to [cjdropshipping.com](https://www.cjdropshipping.com) and create account
2. Apply for API access at [developers.cjdropshipping.com](https://developers.cjdropshipping.com)
3. Get API credentials
4. Add to `.env.local`:
   ```
   CJDROPSHIPPING_API_KEY="..."
   CJDROPSHIPPING_EMAIL="your-cj-email"
   CJDROPSHIPPING_PASSWORD="your-cj-password"
   ```

---

### 6. Create Admin User

1. Start the app: `npm run dev`
2. Go to `/register` and create an account
3. Open Firebase Console > Firestore Database
4. Navigate to the `users` collection
5. Find your user document
6. Change the `role` field from `CUSTOMER` to `ADMIN`
7. Now you can access `/admin` dashboard

---

## Production Deployment (Vercel)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Update these for production:
   ```
   NEXTAUTH_URL="https://your-domain.com"
   NEXT_PUBLIC_APP_URL="https://your-domain.com"
   ```
5. Deploy

### 3. Configure Production Stripe Webhook
1. Go to Stripe Dashboard > Webhooks
2. Add production endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### 4. Configure Custom Domain
1. In Vercel project settings > Domains
2. Add your domain
3. Update DNS records as instructed

---

## Post-Launch Checklist

- [ ] Test complete checkout flow with test card
- [ ] Verify order emails are being sent
- [ ] Test order tracking page
- [ ] Verify all product links work
- [ ] Test mobile responsiveness
- [ ] Set up Google Analytics
- [ ] Configure social media links in footer
- [ ] Set up your actual social media accounts
- [ ] Update `hello@dububu.com` to your real email
- [ ] Test contact form submission

---

## Test Cards for Stripe

Use these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any valid ZIP

---

## Common Issues & Solutions

### "FIREBASE_SERVICE_ACCOUNT_KEY is not set"
- Make sure `.env.local` exists and has the key
- Ensure the JSON is on a single line with no line breaks
- Restart the dev server after changing env vars

### Firebase connection failed
- Check all Firebase environment variables are set correctly
- Ensure the service account has proper permissions
- Check if Firestore is enabled in your Firebase project

### Webhook not receiving events
- For local dev, use Stripe CLI to forward events
- For production, verify webhook URL is correct
- Check webhook signing secret matches

### Admin dashboard returns 404
- Make sure you've created an admin user
- Check user role is set to `ADMIN` in Firestore

### Products not showing
- Run `npm run db:seed` to seed products
- Check Firebase connection in console logs

---

## File Structure Reference

```
dububu/
├── app/
│   ├── (auth)/              # Login, register pages
│   ├── (shop)/              # Track order
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes & webhooks
│   ├── checkout/            # Checkout flow
│   ├── collections/         # Category pages
│   └── shop/                # Product listing & details
├── components/              # Shared UI components
├── features/                # Feature modules
│   ├── auth/                # Auth actions
│   ├── checkout/            # Checkout actions
│   ├── contact/             # Contact form
│   ├── orders/              # Order tracking
│   └── products/            # Product queries & components
├── lib/
│   ├── firebase/            # Firebase config & types
│   ├── vendors/             # Printful, CJ API clients
│   ├── auth.ts              # NextAuth config
│   ├── db.ts                # Firestore operations
│   └── stripe.ts            # Stripe client
├── scripts/
│   └── seed-firebase.ts     # Firestore seeder
└── stores/                  # Zustand stores
```

---

## Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **NextAuth Docs:** https://authjs.dev
- **Printful API:** https://developers.printful.com/docs/
- **CJ API:** https://developers.cjdropshipping.com/

---

## Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Make sure Firebase is connected (check console logs)
4. Check the file referenced in any error stack traces

Good luck with your launch! 🐻🐼
