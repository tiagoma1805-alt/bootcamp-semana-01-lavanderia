import { Schema, model } from 'mongoose';

export interface ILaundryService {
  serviceCode: string;
  name: string;
  category: 'lavado' | 'tintoreria' | 'planchado' | 'limpieza_en_seco';
  price: number;
  estimatedHours: number;
  isActive: boolean;
  createdBy: Schema.Types.ObjectId;
}

const laundryServiceSchema = new Schema<ILaundryService>({
  serviceCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['lavado', 'tintoreria', 'planchado', 'limpieza_en_seco'] 
  },
  price: { type: Number, required: true, min: 0 },
  estimatedHours: { type: Number, required: true, min: 1 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const LaundryServiceModel = model<ILaundryService>('LaundryService', laundryServiceSchema);
