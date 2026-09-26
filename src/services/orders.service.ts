import { OrdersRepository } from '../repositories/orders.repository';
import { Order, CreateOrderDto, UpdateOrderDto, PaginatedResponse } from '../types';

export class OrdersService {
  constructor(private repository: OrdersRepository) {}

  async getOrders(page: number = 1, limit: number = 5): Promise<PaginatedResponse<Order>> {
    const allOrders = await this.repository.findAll();
    const total = allOrders.length;

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const startIndex = (safePage - 1) * safeLimit;
    const paginatedData = allOrders.slice(startIndex, startIndex + safeLimit);

    return {
      data: paginatedData,
      total,
      page: safePage,
      limit: safeLimit
    };
  }

  async getOrderById(id: number): Promise<Order | null> {
    return await this.repository.findById(id);
  }

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    if (!dto.customerName || !dto.garmentType || !dto.serviceType || dto.price === undefined) {
      throw new Error('MISSING_FIELDS');
    }
    return await this.repository.create(dto);
  }

  async updateOrder(id: number, dto: UpdateOrderDto): Promise<Order | null> {
    return await this.repository.update(id, dto);
  }

  async deleteOrder(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}