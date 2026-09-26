import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createServiceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  price: z.number().positive('El precio debe ser mayor a 0'),
  estimatedHours: z.number().int().positive('Las horas estimadas deben ser enteras'),
  category: z.string().regex(objectIdRegex, 'ID de categoría inválido'),
});

export const updateServiceSchema = createServiceSchema.partial();

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 10)),
});
