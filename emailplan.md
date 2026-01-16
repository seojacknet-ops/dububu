# DuBuBu Email System - Hostinger SMTP Integration

## Overview

This project uses **Hostinger SMTP** (via Nodemailer) for all transactional emails instead of Resend, saving $20/month by leveraging unlimited emails included with the `dububu.co` domain hosting.

## Email Addresses

| Address | Purpose |
|---------|---------|
| `orders@dububu.co` | Order confirmations, shipping notifications |
| `hello@dububu.co` | Contact form replies, support, admin notifications |

## Configuration

### Environment Variables

Add these to your `.env.local`:

```env
# Hostinger SMTP Configuration
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="orders@dububu.co"
SMTP_PASSWORD="your-email-password"

# Email addresses
SMTP_FROM_ORDERS="DuBuBu Orders <orders@dububu.co>"
SMTP_FROM_SUPPORT="DuBuBu <hello@dububu.co>"
SMTP_ADMIN_EMAIL="hello@dububu.co"

# Test Mode (set to "true" for development)
EMAIL_TEST_MODE="false"
EMAIL_TEST_RECIPIENT="your-test-email@example.com"
```

### Hostinger Setup

1. Log into **Hostinger hPanel**
2. Go to **Emails** → **Email Accounts**
3. Create these email accounts:
   - `orders@dububu.co` - For transactional order emails
   - `hello@dububu.co` - For support/contact emails
4. Copy the password for `orders@dububu.co` to use as `SMTP_PASSWORD`

### SMTP Settings (Hostinger)

- **Host:** `smtp.hostinger.com`
- **Port:** `465` (SSL) or `587` (TLS)
- **Authentication:** Required (email + password)

## Email Types

### 1. Order Confirmation
**Trigger:** `checkout.session.completed` Stripe webhook  
**File:** [app/api/webhooks/stripe/route.ts](app/api/webhooks/stripe/route.ts)  
**From:** `orders@dububu.co`

Sent automatically when a customer completes checkout. Includes:
- Order number
- Items purchased with quantities and prices
- Order total with shipping
- Shipping address
- Support contact info

### 2. Contact Form
**Trigger:** Contact form submission  
**File:** [features/contact/actions/submit-form.ts](features/contact/actions/submit-form.ts)  
**From:** `hello@dububu.co`

Two emails are sent:
1. **Admin notification** - Sent to `hello@dububu.co` with customer's message
2. **Auto-reply** - Sent to customer confirming receipt

### 3. Shipping Notification (Ready for Use)
**Trigger:** Manual or fulfillment integration  
**File:** [lib/email/templates.ts](lib/email/templates.ts)  
**From:** `orders@dububu.co`

Template ready for when order ships. Call `sendShippingNotificationEmail()` with:
- Order number
- Customer email
- Carrier name
- Tracking number/URL
- Estimated delivery (optional)

## Test Mode

Set `EMAIL_TEST_MODE="true"` in development to:
- Redirect **ALL** emails to `EMAIL_TEST_RECIPIENT`
- Prefix subjects with `[TEST]`
- Log original recipients to console

This prevents accidentally emailing real customers during development.

## Architecture

```
lib/email/
├── smtp.ts          # Nodemailer transport & sendEmail() function
└── templates.ts     # Email content templates
```

### Key Functions

```typescript
// lib/email/smtp.ts
sendEmail({ to, subject, text, html?, from?, replyTo? })
verifyConnection()  // Test SMTP connection
isEmailConfigured() // Check if credentials are set

// lib/email/templates.ts
sendOrderConfirmationEmail(order)
sendContactFormEmails(data)     // Sends both admin + auto-reply
sendShippingNotificationEmail(details)
```

## Rate Limits

Hostinger email limits (typical):
- **500 emails/hour** per account
- **10,000 emails/day** per domain

This is sufficient for small-to-medium order volume. For high-volume:
- Consider implementing a queue system
- Or use multiple sending accounts

## Future Enhancements

- [ ] HTML email templates (React Email/MJML)
- [ ] Abandoned cart emails
- [ ] Password reset emails
- [ ] Review request emails (post-delivery)
- [ ] Welcome email on registration
- [ ] Newsletter integration

## Troubleshooting

### Emails not sending
1. Check `SMTP_USER` and `SMTP_PASSWORD` are correct
2. Verify the email account exists in Hostinger
3. Check console logs for `[EMAIL]` messages
4. Try `verifyConnection()` to test SMTP

### Test mode not working
1. Ensure `EMAIL_TEST_MODE="true"` (string, not boolean)
2. Set `EMAIL_TEST_RECIPIENT` to a valid email

### TypeScript errors
Run `npm install -D @types/nodemailer` if seeing type errors.
