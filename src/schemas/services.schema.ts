import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string({ required_error: 'El nombre es obligatorio' }).min(3),
  code: z.string({ required_error: 'El código es obligatorio' }).min(2),
  description: z.string().optional(),
  price: z.number({ required_error: 'El precio es obligatorio' }).positive(),
  estimatedHours: z.number().int().positive(),
  isAvailable: z.boolean().optional().default(true),
  categoryId: z.string().uuid('El ID de categoría debe ser un UUID válido'),
});

export const updateServiceSchema = createServiceSchema.partial();

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export type CreateServiceDTO = z.infer<typeof createServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>;