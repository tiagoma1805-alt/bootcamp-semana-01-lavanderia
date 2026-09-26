import { Schema, model, Document, Types } from 'mongoose';

export interface IService extends Document {
  name: string;
  price: number;
  estimatedHours: number;
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    estimatedHours: { type: Number, required: true, min: 1 },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

export const ServiceModel = model<IService>('Service', serviceSchema);
