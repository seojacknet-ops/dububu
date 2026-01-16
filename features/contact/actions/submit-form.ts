'use server'

import { z } from 'zod';
import { isEmailConfigured } from '@/lib/email/smtp';
import { sendContactFormEmails } from '@/lib/email/templates';

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

  if (!isEmailConfigured()) {
    return { success: false as const, error: 'Email service is not configured. Please try again later.' };
  }

  const data = parsed.data;

  try {
    const { adminEmail, autoReply } = await sendContactFormEmails(data);

    if (!adminEmail.success) {
      console.error('[CONTACT_FORM] Failed to send admin notification:', adminEmail.error);
      return { success: false as const, error: 'Failed to send message. Please try again.' };
    }

    if (!autoReply.success) {
      // Log but don't fail - the main email was sent
      console.error('[CONTACT_FORM] Failed to send auto-reply:', autoReply.error);
    }

    return { success: true as const };
  } catch (error) {
    console.error('[CONTACT_FORM]', error);
    return { success: false as const, error: 'Failed to send message. Please try again.' };
  }
}
