import { GarmentModel } from '../models/garment.model';
import { GarmentAttributes } from '../types';

export const GarmentsRepository = {
  async findAll(filter: Partial<GarmentAttributes> = {}) {
    return GarmentModel.find(filter).lean();
  },
  async findById(id: string) {
    return GarmentModel.findById(id).lean();
  },
  async findByCode(code: string) {
    return GarmentModel.findOne({ code }).lean();
  },
  async create(data: Omit<GarmentAttributes, 'id'>) {
    return GarmentModel.create(data);
  },
  async update(id: string, data: Partial<GarmentAttributes>) {
    return GarmentModel.findByIdAndUpdate(id, data, { new: true }).lean();
  },
  async delete(id: string) {
    return GarmentModel.findByIdAndDelete(id).lean();
  },
};