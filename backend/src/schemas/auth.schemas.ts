import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(320)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128),
});

export const signUpSchema = loginSchema.extend({
  fullName: z.string().trim().min(1).max(120),
});
