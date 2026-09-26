import { ServiceModel, IService } from '../models/service.model';
import { CategoryModel } from '../models/category.model';
import { AppError } from '../errors/AppError';
import { Error as MongooseError } from 'mongoose';

export class ServiceRepository {
  private handleError(error: unknown): never {
    if (error instanceof AppError) throw error;
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
      throw new AppError('El servicio con este nombre ya existe', 409);
    }
    if (error instanceof MongooseError.CastError) {
      throw new AppError('ID con formato inválido', 400);
    }
    throw error;
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      ServiceModel.find()
        .populate('category', 'name description')
        .skip(skip)
        .limit(limit)
        .lean(),
      ServiceModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: string): Promise<IService> {
    try {
      const service = await ServiceModel.findById(id).populate('category', 'name description');
      if (!service) throw new AppError('Servicio no encontrado', 404);
      return service;
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: Partial<IService>): Promise<IService> {
    try {
      if (data.category) {
        const categoryExists = await CategoryModel.findById(data.category);
        if (!categoryExists) throw new AppError('La categoría especificada no existe', 400);
      }
      const newService = await ServiceModel.create(data);
      return await newService.populate('category', 'name description');
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: Partial<IService>): Promise<IService> {
    try {
      if (data.category) {
        const categoryExists = await CategoryModel.findById(data.category);
        if (!categoryExists) throw new AppError('La categoría especificada no existe', 400);
      }
      const updated = await ServiceModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).populate('category', 'name description');

      if (!updated) throw new AppError('Servicio no encontrado', 404);
      return updated;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<IService> {
    try {
      const deleted = await ServiceModel.findByIdAndDelete(id);
      if (!deleted) throw new AppError('Servicio no encontrado', 404);
      return deleted;
    } catch (error) {
      this.handleError(error);
    }
  }
}
