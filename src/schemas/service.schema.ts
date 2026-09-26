import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del servicio es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .trim(),
  category: z.enum(['lavado', 'seco', 'planchado', 'tintoreria'], {
    errorMap: () => ({
      message: 'La categoría debe ser una de: lavado, seco, planchado, tintoreria',
    }),
  }),
  price: z
    .number({ required_error: 'El precio es obligatorio' })
    .positive('El precio debe ser un valor positivo mayor a 0'),
  estimatedHours: z
    .number()
    .int('Las horas estimadas deben ser un número entero')
    .positive('Las horas estimadas deben ser al menos 1')
    .default(24),
  available: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export const idParamSchema = z.coerce
  .number({ invalid_type_error: 'El ID debe ser numérico' })
  .int('El ID debe ser un número entero')
  .positive('El ID debe ser mayor a 0');

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;