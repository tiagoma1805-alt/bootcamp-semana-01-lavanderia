import { ServiceRepository } from '../repositories/service.repository';
import { IService } from '../models/service.model';

export class ServiceService {
  private repo = new ServiceRepository();

  async getAllPaginated(page: number, limit: number) { return await this.repo.findAllPaginated(page, limit); }
  async getById(id: string): Promise<IService> { return await this.repo.findById(id); }
  async create(data: Partial<IService>): Promise<IService> { return await this.repo.create(data); }
  async update(id: string, data: Partial<IService>): Promise<IService> { return await this.repo.update(id, data); }
  async delete(id: string): Promise<IService> { return await this.repo.delete(id); }
}
