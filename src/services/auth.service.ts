import { UsersRepository } from '../repositories/users.repository';
import { AppError } from '../errors/AppError';
import { generateToken } from '../utils/jwt';

export const AuthService = {
  async login(email: string, pass: string) {
    const user = await UsersRepository.findByEmail(email);
    if (!user || user.password !== pass) {
      throw new AppError(401, 'Credenciales inválidas');
    }
    const token = generateToken({ userId: user._id.toString(), role: user.role });
    return { token, user: { id: user._id, email: user.email, role: user.role } };
  },
};