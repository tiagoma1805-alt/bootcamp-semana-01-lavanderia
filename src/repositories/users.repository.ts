import { UserModel } from '../models/user.model';
import { UserAttributes } from '../types';

export const UsersRepository = {
  async findByEmail(email: string) {
    return UserModel.findOne({ email }).lean();
  },
  async create(data: Partial<UserAttributes>) {
    return UserModel.create(data);
  },
};