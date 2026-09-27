export type ServiceType = 'DRY_CLEAN' | 'WASH_FOLD' | 'PRESSING';

export interface GarmentAttributes {
  id?: string;
  code: string;
  name: string;
  fabricType: string;
  serviceType: ServiceType;
  price: number;
}

export interface UserAttributes {
  id?: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
}

export interface TokenPayload {
  userId: string;
  role: 'ADMIN' | 'USER';
}