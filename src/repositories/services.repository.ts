import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { CreateServiceDTO, UpdateServiceDTO } from '../schemas/services.schema';

export class ServicesRepository {
  async findMany(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.service.findMany({
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.service.count(),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!service) {
      throw new AppError(404, 'Recurso no encontrado');
    }

    return service;
  }

  async create(data: CreateServiceDTO) {
    try {
      return await prisma.service.create({
        data,
        include: { category: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, data: UpdateServiceDTO) {
    try {
      return await prisma.service.update({
        where: { id },
        data,
        include: { category: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      return await prisma.service.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError(404, 'Recurso no encontrado');
      }
      if (error.code === 'P2002') {
        throw new AppError(409, 'Ya existe un registro con ese valor');
      }
    }
    throw error;
  }
}