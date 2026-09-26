import { Request, Response, NextFunction } from 'express';
import { ServicesService } from '../services/services.service';
import { createServiceSchema, updateServiceSchema, paginationQuerySchema } from '../schemas/services.schema';
import { AppError } from '../errors/AppError';

export class ServicesController {
  private service: ServicesService;

  constructor() {
    this.service = new ServicesService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = paginationQuerySchema.parse(req.query);
      const result = await this.service.getServices(page, limit);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const item = await this.service.getServiceById(id);
      return res.status(200).json(item);
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = createServiceSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errorMessages = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new AppError(400, `Datos de entrada inválidos: ${errorMessages}`);
      }
      const newItem = await this.service.createService(parseResult.data);
      return res.status(201).json(newItem);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const parseResult = updateServiceSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errorMessages = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new AppError(400, `Datos de entrada inválidos: ${errorMessages}`);
      }
      const updatedItem = await this.service.updateService(id, parseResult.data);
      return res.status(200).json(updatedItem);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.deleteService(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
}