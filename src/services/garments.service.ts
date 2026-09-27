import { GarmentsRepository } from '../repositories/garments.repository';
import { AppError } from '../errors/AppError';
import { GarmentAttributes, ServiceType } from '../types';

export const GarmentsService = {
  async getAll(serviceType?: ServiceType) {
    const filter = serviceType ? { serviceType } : {};
    return GarmentsRepository.findAll(filter);
  },

  async getById(id: string) {
    const garment = await GarmentsRepository.findById(id);
    if (!garment) {
      throw new AppError(404, 'Prenda no encontrada');
    }
    return garment;
  },

  async create(data: Omit<GarmentAttributes, 'id'>) {
    const exists = await GarmentsRepository.findByCode(data.code);
    if (exists) {
      throw new AppError(409, 'El código de prenda ya existe');
    }
    return GarmentsRepository.create(data);
  },

  async update(id: string, data: Partial<GarmentAttributes>) {
    const updated = await GarmentsRepository.update(id, data);
    if (!updated) {
      throw new AppError(404, 'Prenda no encontrada');
    }
    return updated;
  },

  async delete(id: string) {
    const deleted = await GarmentsRepository.delete(id);
    if (!deleted) {
      throw new AppError(404, 'Prenda no encontrada');
    }
    return deleted;
  },
};