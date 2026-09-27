import { z } from 'zod';

export const garmentSchema = z.object({
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  fabricType: z.string().min(2, 'El tipo de tela es requerido'),
  serviceType: z.enum(['DRY_CLEAN', 'WASH_FOLD', 'PRESSING']),
  price: z.number().positive('El precio debe ser positivo'),
});