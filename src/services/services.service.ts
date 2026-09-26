import { servicesRepository } from '../repositories/services.repository';
import { CreateServiceInput, UpdateServiceInput } from '../schemas/service.schema';
import { AppError } from '../errors/AppError';
import { PaginatedResponse, Service } from '../types';

class ServicesService {
  getAll(page: number, limit: number): PaginatedResponse<Service> {
    const { items, total } = servicesRepository.findAll(page, limit);
    return {
      data: items,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  getById(id: number): Service {
    const service = servicesRepository.findById(id);
    if (!service) {
      throw new AppError(404, `El servicio de lavandería con ID ${id} no existe`);
    }
    return service;
  }

  create(data: CreateServiceInput): Service {
    return servicesRepository.create(data);
  }

  update(id: number, data: UpdateServiceInput): Service {
    this.getById(id);
    const updated = servicesRepository.update(id, data);
    if (!updated) {
      throw new AppError(404, `No se pudo actualizar el servicio con ID ${id}`);
    }
    return updated;
  }

  delete(id: number): void {
    this.getById(id);
    servicesRepository.delete(id);
  }
}

export const servicesService = new ServicesService();