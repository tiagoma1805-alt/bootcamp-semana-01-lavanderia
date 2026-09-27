import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { UserModel } from '../models/user.model';
import { UsersRepository } from '../repositories/users.repository';
import { GarmentsRepository } from '../repositories/garments.repository';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}, 60000);

afterEach(async () => {
  await UserModel.deleteMany({});
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 60000);

describe('Auth HTTP Integration Tests (/api/v1/auth)', () => {
  describe('POST /api/v1/auth/login', () => {
    it('debe retornar 200 y el token JWT con credenciales válidas', async () => {
      await UserModel.create({
        email: 'admin@lavanderia.com',
        password: 'password123',
        role: 'ADMIN',
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@lavanderia.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('admin@lavanderia.com');
    });

    it('debe retornar 401 con credenciales incorrectas', async () => {
      await UserModel.create({
        email: 'admin@lavanderia.com',
        password: 'password123',
        role: 'ADMIN',
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@lavanderia.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
    });

    it('debe retornar 422 si la estructura del body es inválida (Zod)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: '',
        });

      expect(res.status).toBe(422);
    });
  });

  describe('Direct Repositories Coverage', () => {
    it('debe invocar directamente los métodos del repositorio de usuarios', async () => {
      const createdUser = await UsersRepository.create({
        email: 'repo@lavanderia.com',
        password: 'password123',
        role: 'USER',
      });

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe('repo@lavanderia.com');

      const foundUser = await UsersRepository.findByEmail('repo@lavanderia.com');
      expect(foundUser).not.toBeNull();
    }, 30000);

    it('debe invocar directamente los métodos del repositorio de prendas', async () => {
      const created = await GarmentsRepository.create({
        code: 'LAV-900',
        name: 'Prenda Repo',
        fabricType: 'Seda',
        serviceType: 'DRY_CLEAN',
        price: 100,
      });
      expect(created).toBeDefined();

      const found = await GarmentsRepository.findById(created._id.toString());
      expect(found).not.toBeNull();
    }, 30000);
  });
});