import { Schema, model } from 'mongoose';
import { GarmentAttributes } from '../types';

const garmentSchema = new Schema<GarmentAttributes>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fabricType: { type: String, required: true },
  serviceType: { 
    type: String, 
    enum: ['DRY_CLEAN', 'WASH_FOLD', 'PRESSING'], 
    required: true 
  },
  price: { type: Number, required: true },
});

export const GarmentModel = model<GarmentAttributes>('Garment', garmentSchema);