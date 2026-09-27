import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre es obligatorio' }).min(2),
    email: z.string({ required_error: 'El email es obligatorio' }).email('Email inválido'),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['admin', 'operator']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'El email es obligatorio' }).email('Email inválido'),
    password: z.string({ required_error: 'La contraseña es obligatoria' }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
