'use server'

import { z } from 'zod';
import { resend } from '@/lib/email/resend';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().default('general'),
  message: z.string().min(10),
});

export async function submitContactForm(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { success: false as const, error: 'Please complete all required fields.' };
  }

  if (!resend) {
    return { success: false as const, error: 'Email service is not configured. Please try again later.' };
  }

  const data = parsed.data;

  try {
    await resend.emails.send({
      from: 'DuBuBu Contact <noreply@dububu.com>',
      to: 'hello@dububu.com',
      subject: `[Contact Form] ${data.subject} - ${data.name}`,
      text: `From: ${data.name} (${data.email})\n\n${data.message}`,
    });

    await resend.emails.send({
      from: 'DuBuBu <hello@dububu.com>',
      to: data.email,
      subject: 'We received your message! 💕',
      text: `Hi ${data.name},\n\nThank you for reaching out! We've received your message and will respond within 24-48 hours.\n\nLove,\nBubu & Dudu 🐻🐼`,
    });

    return { success: true as const };
  } catch (error) {
    console.error('[CONTACT_FORM]', error);
    return { success: false as const, error: 'Failed to send message. Please try again.' };
  }
}
