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
  createdAt: string;
}

export type CreateOrderDto = Omit<Order, 'id' | 'createdAt'>;
export type UpdateOrderDto = Partial<CreateOrderDto>;

// Contratos de respuesta obligatorios
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: string;
  message: string;
}