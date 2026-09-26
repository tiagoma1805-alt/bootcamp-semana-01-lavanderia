import { Router } from 'express';
import { OrdersRepository } from '../repositories/orders.repository';
import { OrdersService } from '../services/orders.service';
import { OrdersController } from '../controllers/orders.controller';

const router = Router();

const repository = new OrdersRepository();
const service = new OrdersService(repository);
const controller = new OrdersController(service);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;