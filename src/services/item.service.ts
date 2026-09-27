import { LaundryServiceModel, ILaundryService } from '../models/item.model';

export class LaundryService {
  static async getAll() {
    return await LaundryServiceModel.find().populate('createdBy', 'name email');
  }

  static async getById(id: string) {
    return await LaundryServiceModel.findById(id).populate('createdBy', 'name email');
  }

  static async create(data: Partial<ILaundryService>, userId: string) {
    const existingCode = await LaundryServiceModel.findOne({ serviceCode: data.serviceCode });
    if (existingCode) throw new Error('El código de servicio de lavandería ya existe.');

    return await LaundryServiceModel.create({ ...data, createdBy: userId });
  }

  static async update(id: string, data: Partial<ILaundryService>, userId: string, userRole: string) {
    const item = await LaundryServiceModel.findById(id);
    if (!item) throw new Error('Servicio de lavandería no encontrado.');

    // Verificación de propiedad o rol de administrador
    if (item.createdBy.toString() !== userId && userRole !== 'admin') {
      throw new Error('No tiene autorización para actualizar este servicio.');
    }

    Object.assign(item, data);
    return await item.save();
  }

  static async delete(id: string) {
    const deleted = await LaundryServiceModel.findByIdAndDelete(id);
    if (!deleted) throw new Error('Servicio de lavandería no encontrado.');
    return deleted;
  }
}
