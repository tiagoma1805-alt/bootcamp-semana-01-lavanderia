import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';
import { createServiceSchema, updateServiceSchema, paginationQuerySchema } from '../schemas/service.schema';

export class ServiceController {
  private service = new ServiceService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = paginationQuerySchema.parse(req.query);
      res.status(200).json(await this.service.getAllPaginated(page, limit));
    } catch (e) { next(e); }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await this.service.getById(req.params.id)); } catch (e) { next(e); }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = createServiceSchema.parse(req.body);
      res.status(201).json(await this.service.create(validated as any));
    } catch (e) { next(e); }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = updateServiceSchema.parse(req.body);
      res.status(200).json(await this.service.update(req.params.id, validated as any));
    } catch (e) { next(e); }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  };
}
