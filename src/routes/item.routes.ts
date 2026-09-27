import { Router } from 'express';
import { 
  getLaundryServices, 
  getLaundryServiceById, 
  createLaundryService, 
  updateLaundryService, 
  deleteLaundryService 
} from '../controllers/item.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// GET: Público o Autenticado para consultar el catálogo de lavandería
router.get('/', getLaundryServices);
router.get('/:id', getLaundryServiceById);

// POST: Crear servicio (Requiere Autenticación)
router.post('/', authMiddleware, createLaundryService);

// PATCH: Actualizar servicio (Requiere Autenticación, verificado en controller si es dueño o admin)
router.patch('/:id', authMiddleware, updateLaundryService);

// DELETE: Eliminar servicio (Exclusivo para Rol ADMIN)
router.delete('/:id', authMiddleware, requireRole('admin'), deleteLaundryService);

export default router;
