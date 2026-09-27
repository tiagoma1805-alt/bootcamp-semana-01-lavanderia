import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderInput, UpdateOrderInput } from '../schemas/order.schema';
import { AppError } from '../errors/AppError';

export class OrderService {
  private repository: OrderRepository;

  constructor() {
    this.repository = new OrderRepository();
  }

  async getAllOrders() {
    return this.repository.findAll();
  }

  async getOrderById(id: string) {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new AppError('Orden de lavandería no encontrada', 404);
    }
    return order;
  }

  async createOrder(data: CreateOrderInput, userId: string) {
    return this.repository.create(data, userId);
  }

  async updateOrder(id: string, data: UpdateOrderInput) {
    await this.getOrderById(id);
    return this.repository.update(id, data);
  }

  async deleteOrder(id: string) {
    await this.getOrderById(id);
    return this.repository.delete(id);
  }
}
