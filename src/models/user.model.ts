import { Schema, model } from 'mongoose';
import { UserAttributes } from '../types';

const userSchema = new Schema<UserAttributes>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
});

export const UserModel = model<UserAttributes>('User', userSchema);