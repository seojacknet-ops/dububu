'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export async function register(input: RegisterInput) {
  try {
    const validated = registerSchema.parse(input);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create user in Firestore
    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);

    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
