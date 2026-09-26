import { Service } from '../types';

class ServicesRepository {
  private services: Service[] = [
    { id: 1, name: 'Lavado Básico por Kilo', category: 'lavado', price: 15.0, estimatedHours: 24, available: true },
    { id: 2, name: 'Limpieza en Seco Saco/Terno', category: 'seco', price: 45.0, estimatedHours: 48, available: true },
    { id: 3, name: 'Planchado de Camisa Ejecutiva', category: 'planchado', price: 10.0, estimatedHours: 12, available: true },
    { id: 4, name: 'Tintorería Vestido de Novia/Fiesta', category: 'tintoreria', price: 95.0, estimatedHours: 72, available: true },
  ];
  private nextId = 5;

  findAll(page: number, limit: number): { items: Service[]; total: number } {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      items: this.services.slice(start, end),
      total: this.services.length,
    };
  }

  findById(id: number): Service | undefined {
    return this.services.find((s) => s.id === id);
  }

  create(data: Omit<Service, 'id'>): Service {
    const newService: Service = { id: this.nextId++, ...data };
    this.services.push(newService);
    return newService;
  }

  update(id: number, data: Partial<Omit<Service, 'id'>>): Service | undefined {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    this.services[index] = { ...this.services[index], ...data };
    return this.services[index];
  }

  delete(id: number): boolean {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.services.splice(index, 1);
    return true;
  }
}

export const servicesRepository = new ServicesRepository();