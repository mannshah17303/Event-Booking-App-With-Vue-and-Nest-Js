import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be at most 50 characters long'),
    email: z
      .email('Invalid email format')
      .max(255, 'Email must be at most 255 characters'),
    role: z.enum(['admin', 'user']),
    password: z
      .string()
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
  })
  .required();

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be at most 50 characters long'),
    email: z
      .email('Invalid email format')
      .max(255, 'Email must be at most 255 characters'),
    role: z.enum(['admin', 'user']),
  })
  .required();

export const loginUserSchema = z
  .object({
    email: z
      .email('Invalid email format')
      .max(255, 'Email must be at most 255 characters'),
    password: z
      .string()
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
