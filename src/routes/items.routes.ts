import { Router, Request, Response } from 'express';
import { store } from '../store';
import { CreateOrderDto } from '../types';

const router = Router();

// GET /api/v1/orders - Listar todas
router.get('/', (_req: Request, res: Response) => {
  const orders = store.getAll();
  res.status(200).json(orders);
});

// GET /api/v1/orders/:id - Obtener por ID
router.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero' });
  }

  const order = store.getById(id);
  if (!order) {
    return res.status(404).json({ error: 'Orden de lavandería no encontrada' });
  }

  res.status(200).json(order);
});

// POST /api/v1/orders - Crear orden
router.post('/', (req: Request, res: Response) => {
  const { customerName, garmentType, serviceType, price, status, isPaid } = req.body as CreateOrderDto;

  if (!customerName || !garmentType || !serviceType || price === undefined || !status) {
    return res.status(400).json({
      error: 'Campos requeridos faltantes: customerName, garmentType, serviceType, price, status'
    });
  }

  const newOrder = store.create({
    customerName,
    garmentType,
    serviceType,
    price: Number(price),
    status,
    isPaid: Boolean(isPaid)
  });

  res.status(201).json(newOrder);
});

// PUT /api/v1/orders/:id - Actualizar orden
router.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero' });
  }

  const existingOrder = store.getById(id);
  if (!existingOrder) {
    return res.status(404).json({ error: 'Orden de lavandería no encontrada' });
  }

  const { customerName, garmentType, serviceType, price, status, isPaid } = req.body as CreateOrderDto;

  if (!customerName || !garmentType || !serviceType || price === undefined || !status) {
    return res.status(400).json({
      error: 'Campos requeridos faltantes para actualización: customerName, garmentType, serviceType, price, status'
    });
  }

  const updatedOrder = store.update(id, {
    customerName,
    garmentType,
    serviceType,
    price: Number(price),
    status,
    isPaid: Boolean(isPaid)
  });

  res.status(200).json(updatedOrder);
});

// DELETE /api/v1/orders/:id - Eliminar orden
router.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número entero' });
  }

  const isDeleted = store.remove(id);
  if (!isDeleted) {
    return res.status(404).json({ error: 'Orden de lavandería no encontrada' });
  }

  res.status(204).send();
});

export default router;