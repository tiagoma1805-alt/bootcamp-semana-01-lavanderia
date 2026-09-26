import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';

const router = Router();
const controller = new ServiceController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export const serviceRoutes = router;
