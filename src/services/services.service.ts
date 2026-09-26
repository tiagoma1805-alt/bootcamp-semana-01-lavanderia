import { ServicesRepository } from '../repositories/services.repository';
import { CreateServiceDTO, UpdateServiceDTO } from '../schemas/services.schema';

export class ServicesService {
  private repository: ServicesRepository;

  constructor() {
    this.repository = new ServicesRepository();
  }

  async getServices(page: number = 1, limit: number = 10) {
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 10;

    const { data, total } = await this.repository.findMany(validPage, validLimit);

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
    };
  }

  async getServiceById(id: string) {
    return await this.repository.findById(id);
  }

  async createService(dto: CreateServiceDTO) {
    return await this.repository.create(dto);
  }

  async updateService(id: string, dto: UpdateServiceDTO) {
    return await this.repository.update(id, dto);
  }

  async deleteService(id: string) {
    await this.repository.delete(id);
  }
}