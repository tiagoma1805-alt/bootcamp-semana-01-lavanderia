import { Order, CreateOrderDto } from './types';

let orders: Order[] = [
  {
    id: 1,
    customerName: 'Carlos Mendoza',
    garmentType: 'Traje de 2 piezas',
    serviceType: 'Lavado en seco',
    price: 35000,
    status: 'en_proceso',
    isPaid: true
  },
  {
    id: 2,
    customerName: 'Ana Gómez',
    garmentType: 'Edredón King Size',
    serviceType: 'Lavado general',
    price: 45000,
    status: 'pendiente',
    isPaid: false
  }
];

let nextId = 3;

export const store = {
  getAll: (): Order[] => orders,

  getById: (id: number): Order | undefined => {
    return orders.find((order) => order.id === id);
  },

  create: (data: CreateOrderDto): Order => {
    const newOrder: Order = {
      id: nextId++,
      ...data
    };
    orders.push(newOrder);
    return newOrder;
  },

  update: (id: number, data: CreateOrderDto): Order | undefined => {
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return undefined;

    orders[index] = { id, ...data };
    return orders[index];
  },

  remove: (id: number): boolean => {
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return false;

    orders.splice(index, 1);
    return true;
  }
};