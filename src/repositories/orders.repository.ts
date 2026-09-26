import { Order, CreateOrderDto, UpdateOrderDto } from '../types';

export class OrdersRepository {
  private orders: Order[] = [
    {
      id: 1,
      customerName: 'Carlos Mendoza',
      garmentType: 'Traje de 2 piezas',
      serviceType: 'Lavado en seco',
      price: 35000,
      status: 'en_proceso',
      isPaid: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      customerName: 'Ana Gómez',
      garmentType: 'Edredón King Size',
      serviceType: 'Lavado general',
      price: 45000,
      status: 'pendiente',
      isPaid: false,
      createdAt: new Date().toISOString()
    }
  ];
  private nextId = 3;

  async findAll(): Promise<Order[]> {
    return JSON.parse(JSON.stringify(this.orders));
  }

  async findById(id: number): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return null;
    return JSON.parse(JSON.stringify(order));
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const newOrder: Order = {
      id: this.nextId++,
      ...dto,
      createdAt: new Date().toISOString()
    };
    this.orders.push(newOrder);
    return JSON.parse(JSON.stringify(newOrder));
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order | null> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    this.orders[index] = {
      ...this.orders[index],
      ...dto
    };
    return JSON.parse(JSON.stringify(this.orders[index]));
  }

  async delete(id: number): Promise<boolean> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return false;

    this.orders.splice(index, 1);
    return true;
  }
}