import { Request, Response, NextFunction } from 'express';
import { GarmentsService } from '../services/garments.service';
import { garmentSchema } from '../validators/garments.schema';
import { ServiceType } from '../types';

export const GarmentsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceType } = req.query;
      const garments = await GarmentsService.getAll(serviceType as ServiceType);
      return res.status(200).json(garments);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const garment = await GarmentsService.getById(req.params.id);
      return res.status(200).json(garment);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = garmentSchema.parse(req.body);
      const garment = await GarmentsService.create(data);
      return res.status(201).json(garment);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = garmentSchema.partial().parse(req.body);
      const garment = await GarmentsService.update(req.params.id, data);
      return res.status(200).json(garment);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await GarmentsService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};