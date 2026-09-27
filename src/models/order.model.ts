import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customerName: string;
  garmentDescription: string;
  serviceType: 'lavado' | 'tintoreria' | 'planchado' | 'completo';
  totalPrice: number;
  status: 'pendiente' | 'en_proceso' | 'listo' | 'entregado';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    garmentDescription: { type: String, required: true, trim: true },
    serviceType: {
      type: String,
      enum: ['lavado', 'tintoreria', 'planchado', 'completo'],
      default: 'lavado',
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pendiente', 'en_proceso', 'listo', 'entregado'],
      default: 'pendiente',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
