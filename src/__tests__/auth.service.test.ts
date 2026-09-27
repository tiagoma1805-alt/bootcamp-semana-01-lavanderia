import { AuthService } from '../services/auth.service';
import { UsersRepository } from '../repositories/users.repository';
import { AppError } from '../errors/AppError';

jest.mock('../repositories/users.repository');

describe('AuthService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe autenticar al usuario correctamente con credenciales válidas', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'admin@lavanderia.com',
      password: 'password123',
      role: 'ADMIN' as const,
    };

    (UsersRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

    const result = await AuthService.login('admin@lavanderia.com', 'password123');

    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe('admin@lavanderia.com');
  });

  it('debe lanzar AppError 401 si el usuario no existe', async () => {
    (UsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(AuthService.login('notfound@lavanderia.com', 'password123'))
      .rejects
      .toThrow(new AppError(401, 'Credenciales inválidas'));
  });

  it('debe lanzar AppError 401 si la contraseña es incorrecta', async () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'admin@lavanderia.com',
      password: 'password123',
      role: 'ADMIN' as const,
    };

    (UsersRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(AuthService.login('admin@lavanderia.com', 'wrongpassword'))
      .rejects
      .toThrow(new AppError(401, 'Credenciales inválidas'));
  });
});