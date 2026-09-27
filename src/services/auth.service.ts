import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

export class AuthService {
  static async register(userData: any) {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) throw new Error('El correo electrónico ya está registrado.');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword
    });

    return { id: user._id, name: user.name, email: user.email, role: user.role };
  }

  static async login(credentials: any) {
    const user = await UserModel.findOne({ email: credentials.email });
    if (!user) throw new Error('Credenciales inválidas.');

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) throw new Error('Credenciales inválidas.');

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
  }
}
