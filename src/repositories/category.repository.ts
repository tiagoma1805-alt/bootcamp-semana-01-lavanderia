import { CategoryModel, ICategory } from '../models/category.model';
import { AppError } from '../errors/AppError';
import { Error as MongooseError } from 'mongoose';

export class CategoryRepository {
  private handleError(error: unknown): never {
    if (error instanceof AppError) throw error;
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000) {
      throw new AppError('La categoría ya existe', 409);
    }
    if (error instanceof MongooseError.CastError) {
      throw new AppError('ID de categoría con formato inválido', 400);
    }
    throw error;
  }

  async findAll(): Promise<ICategory[]> {
    return await CategoryModel.find().lean();
  }

  async findById(id: string): Promise<ICategory> {
    try {
      const category = await CategoryModel.findById(id);
      if (!category) throw new AppError('Categoría no encontrada', 404);
      return category;
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    try {
      return await CategoryModel.create(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory> {
    try {
      const category = await CategoryModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!category) throw new AppError('Categoría no encontrada', 404);
      return category;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<ICategory> {
    try {
      const category = await CategoryModel.findByIdAndDelete(id);
      if (!category) throw new AppError('Categoría no encontrada', 404);
      return category;
    } catch (error) {
      this.handleError(error);
    }
  }
}
