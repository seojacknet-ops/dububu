import { z } from 'zod';

// Shipping Address Schema
export const shippingAddressSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    address1: z.string().min(1, 'Address is required').max(200),
    address2: z.string().max(200).optional(),
    city: z.string().min(1, 'City is required').max(100),
    state: z.string().min(1, 'State is required').max(100),
    zipCode: z.string().min(1, 'ZIP code is required').max(20),
    country: z.string().min(1, 'Country is required').max(100),
    phone: z.string().max(20).optional(),
});

// Checkout Form Schema
export const checkoutSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    shipping: shippingAddressSchema,
    sameAsBilling: z.boolean().default(true),
    billing: shippingAddressSchema.optional(),
});

// Contact Form Schema
export const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required').max(200),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

// Newsletter Schema
export const newsletterSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

// Type exports from schemas
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
