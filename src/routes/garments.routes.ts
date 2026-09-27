import { Router } from 'express';
import { GarmentsController } from '../controllers/garments.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', GarmentsController.getAll);
router.get('/:id', GarmentsController.getById);

router.post('/', authenticate, GarmentsController.create);
router.put('/:id', authenticate, GarmentsController.update);
router.delete('/:id', authenticate, requireAdmin, GarmentsController.delete);

export default router;