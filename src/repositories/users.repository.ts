import { UserModel, IUser } from '../models/user.model';
import { RegisterInput } from '../schemas/auth.schema';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }

  async create(data: RegisterInput): Promise<IUser> {
    return UserModel.create(data);
  }

  async updateRefreshTokenHash(userId: string, hash: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshTokenHash: hash }).exec();
  }
}
