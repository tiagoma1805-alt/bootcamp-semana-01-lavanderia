import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/users.repository';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshTokenHash(user._id.toString(), refreshTokenHash);

    return {
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError('Refresh Token no proporcionado', 401);
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Refresh Token inválido o expirado', 401);
    }

    const user = await this.userRepository.findById(payload.id);
    if (!user || !user.refreshTokenHash) {
      throw new AppError('Acceso no autorizado', 401);
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      await this.userRepository.updateRefreshTokenHash(user._id.toString(), null);
      throw new AppError('Refresh Token revocado por seguridad', 401);
    }

    const newPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepository.updateRefreshTokenHash(user._id.toString(), newRefreshHash);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    await this.userRepository.updateRefreshTokenHash(userId, null);
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
