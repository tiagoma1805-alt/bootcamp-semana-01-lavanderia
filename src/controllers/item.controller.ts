import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { LaundryService } from '../services/item.service';

export const getLaundryServices = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const services = await LaundryService.getAll();
    res.status(200).json({ count: services.length, data: services });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener servicios de lavandería.' });
  }
};

export const getLaundryServiceById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const service = await LaundryService.getById(req.params.id);
    if (!service) {
      res.status(404).json({ message: 'Servicio de lavandería no encontrado' });
      return;
    }
    res.status(200).json({ data: service });
  } catch (error: any) {
    res.status(400).json({ error: 'ID de servicio no válido' });
  }
};

export const createLaundryService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const newService = await LaundryService.create(req.body, userId);
    res.status(201).json({ message: 'Servicio de lavandería creado con éxito', data: newService });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateLaundryService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const updated = await LaundryService.update(req.params.id, req.body, userId, userRole);
    res.status(200).json({ message: 'Servicio de lavandería actualizado', data: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteLaundryService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await LaundryService.delete(req.params.id);
    res.status(200).json({ message: 'Servicio de lavandería eliminado correctamente por el Administrador.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
