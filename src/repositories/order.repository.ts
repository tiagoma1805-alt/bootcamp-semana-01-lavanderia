import { OrderModel, IOrder } from '../models/order.model';
import { CreateOrderInput, UpdateOrderInput } from '../schemas/order.schema';

export class OrderRepository {
  async findAll(): Promise<IOrder[]> {
    return OrderModel.find().populate('createdBy', 'name email role').exec();
  }

  async findById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id).populate('createdBy', 'name email role').exec();
  }

  async create(data: CreateOrderInput, userId: string): Promise<IOrder> {
    return OrderModel.create({
      ...data,
      createdBy: userId,
    });
  }

  async update(id: string, data: UpdateOrderInput): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(id: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndDelete(id).exec();
  }
}
