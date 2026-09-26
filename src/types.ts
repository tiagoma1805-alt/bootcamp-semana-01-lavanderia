export type Category = 'lavado' | 'seco' | 'planchado' | 'tintoreria';

export interface Service {
  id: number;
  name: string;
  category: Category;
  price: number;
  estimatedHours: number;
  available: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}