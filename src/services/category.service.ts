import { CategoryRepository } from '../repositories/category.repository';
import { ICategory } from '../models/category.model';

export class CategoryService {
  private repo = new CategoryRepository();

  async getAll(): Promise<ICategory[]> { return await this.repo.findAll(); }
  async getById(id: string): Promise<ICategory> { return await this.repo.findById(id); }
  async create(data: Partial<ICategory>): Promise<ICategory> { return await this.repo.create(data); }
  async update(id: string, data: Partial<ICategory>): Promise<ICategory> { return await this.repo.update(id, data); }
  async delete(id: string): Promise<ICategory> { return await this.repo.delete(id); }
}
