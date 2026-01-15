'use server';

import { signIn } from '@/lib/auth';
import { z } from 'zod';
import { AuthError } from 'next-auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export async function login(input: LoginInput, redirectTo?: string) {
  try {
    const validated = loginSchema.parse(input);

    await signIn('credentials', {
      email: validated.email,
      password: validated.password,
      redirectTo: redirectTo || '/',
    });

    return { success: true };
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Invalid email or password' };
        default:
          return { success: false, error: 'Something went wrong. Please try again.' };
      }
    }

    // This throw is needed for redirect to work
    throw error;
  }
}
