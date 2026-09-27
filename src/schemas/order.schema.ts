import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z
      .string({ required_error: 'El nombre del cliente es obligatorio' })
      .min(2, 'Mínimo 2 caracteres'),
    garmentDescription: z
      .string({ required_error: 'La descripción de prendas es obligatoria' })
      .min(3, 'Descripción muy corta'),
    serviceType: z.enum(['lavado', 'tintoreria', 'planchado', 'completo'], {
      required_error: 'El tipo de servicio es obligatorio',
    }),
    totalPrice: z
      .number({ required_error: 'El precio total es obligatorio' })
      .positive('El precio debe ser mayor a 0'),
    status: z.enum(['pendiente', 'en_proceso', 'listo', 'entregado']).optional(),
  }),
});

export const updateOrderSchema = z.object({
  body: createOrderSchema.shape.body.partial(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>['body'];
