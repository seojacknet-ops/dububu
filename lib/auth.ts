import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  // No adapter needed - we handle user creation manually with Firebase
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth sign in - create user if doesn't exist
      if (account?.provider === 'google') {
        const email = user.email;
        if (!email) return false;

        // Check if user exists in Firestore
        const existingUser = await db.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          // Create new user for Google OAuth in Firestore
          await db.user.create({
            data: {
              email,
              name: user.name || '',
              image: user.image || undefined,
              emailVerified: Timestamp.now(),
              role: 'CUSTOMER',
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'CUSTOMER';
      }
      // For OAuth users, fetch user from Firestore to get role
      if (token.email && !token.id) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

// Helper to get current user from server components
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

// Helper to check if user is admin
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}
