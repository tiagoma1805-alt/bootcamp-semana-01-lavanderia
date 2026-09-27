import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { createOrderSchema, updateOrderSchema } from '../schemas/order.schema';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createOrderSchema.parse({ body: req.body });
      const userId = (req as any).user?.id || (req as any).user?._id;

      const order = await this.orderService.createOrder(parsed.body, userId);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = updateOrderSchema.parse({ body: req.body });
      const { id } = req.params;
      const updatedOrder = await this.orderService.updateOrder(id, parsed.body);
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.orderService.deleteOrder(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
