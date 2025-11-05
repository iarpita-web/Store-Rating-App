import { z } from 'zod';

// Public signup: allow only USER or OWNER roles
export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(['USER', 'OWNER']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

// Admin-only: can create users with any role
export const adminCreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(['ADMIN', 'USER', 'OWNER']).default('USER'),
});
