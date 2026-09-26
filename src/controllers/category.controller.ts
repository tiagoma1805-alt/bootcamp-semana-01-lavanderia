import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

export class CategoryController {
  private service = new CategoryService();

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await this.service.getAll()); } catch (e) { next(e); }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await this.service.getById(req.params.id)); } catch (e) { next(e); }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = createCategorySchema.parse(req.body);
      res.status(201).json(await this.service.create(validated));
    } catch (e) { next(e); }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = updateCategorySchema.parse(req.body);
      res.status(200).json(await this.service.update(req.params.id, validated));
    } catch (e) { next(e); }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  };
}
