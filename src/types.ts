export type ServiceType = 'Lavado en seco' | 'Lavado general' | 'Planchado' | 'Tintorería y Teñido';
export type OrderStatus = 'pendiente' | 'en_proceso' | 'listo' | 'entregado';

export interface Order {
  id: number;
  customerName: string;
  garmentType: string;
  serviceType: ServiceType;
  price: number;
  status: OrderStatus;
  isPaid: boolean;
}

export type CreateOrderDto = Omit<Order, 'id'>;