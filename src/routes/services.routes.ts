import { Router } from 'express';
import { ServicesController } from '../controllers/services.controller';

const router = Router();
const controller = new ServicesController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;