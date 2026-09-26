import { Request, Response, NextFunction } from 'express';
import { createServiceSchema, updateServiceSchema, idParamSchema } from '../schemas/service.schema';
import { servicesService } from '../services/services.service';

export class ServicesController {
  static getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const result = servicesService.getAll(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static getById(req: Request, res: Response, next: NextFunction) {
    try {
      const idResult = idParamSchema.safeParse(req.params.id);
      if (!idResult.success) {
        return next(idResult.error);
      }
      const service = servicesService.getById(idResult.data);
      res.json({ data: service });
    } catch (err) {
      next(err);
    }
  }

  static create(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = createServiceSchema.safeParse(req.body);
      if (!validation.success) {
        return next(validation.error);
      }
      const newService = servicesService.create(validation.data);
      res.status(201).json({ data: newService });
    } catch (err) {
      next(err);
    }
  }

  static update(req: Request, res: Response, next: NextFunction) {
    try {
      const idResult = idParamSchema.safeParse(req.params.id);
      if (!idResult.success) {
        return next(idResult.error);
      }

      const validation = updateServiceSchema.safeParse(req.body);
      if (!validation.success) {
        return next(validation.error);
      }

      const updatedService = servicesService.update(idResult.data, validation.data);
      res.json({ data: updatedService });
    } catch (err) {
      next(err);
    }
  }

  static delete(req: Request, res: Response, next: NextFunction) {
    try {
      const idResult = idParamSchema.safeParse(req.params.id);
      if (!idResult.success) {
        return next(idResult.error);
      }

      servicesService.delete(idResult.data);
      res.status(200).json({ status: 'success', message: 'Servicio eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }
}