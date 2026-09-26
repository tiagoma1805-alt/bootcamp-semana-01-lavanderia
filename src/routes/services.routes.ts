import { Router } from 'express';
import { ServicesController } from '../controllers/services.controller';

const router = Router();

router.get('/', ServicesController.getAll);
router.get('/:id', ServicesController.getById);
router.post('/', ServicesController.create);
router.put('/:id', ServicesController.update);
router.delete('/:id', ServicesController.delete);

export default router;