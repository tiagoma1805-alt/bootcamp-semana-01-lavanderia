import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { GarmentModel } from '../models/garment.model';
import { generateToken } from '../utils/jwt';
import { GarmentsService } from '../services/garments.service';
import { GarmentsRepository } from '../repositories/garments.repository';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  adminToken = generateToken({ userId: new mongoose.Types.ObjectId().toString(), role: 'ADMIN' });
  userToken = generateToken({ userId: new mongoose.Types.ObjectId().toString(), role: 'USER' });
}, 60000);

afterEach(async () => {
  await GarmentModel.deleteMany({});
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 60000);

describe('Garments HTTP Integration Tests (/api/v1/items)', () => {
  describe('GET /api/v1/items', () => {
    it('debe retornar 200 con un array vacío inicialmente', async () => {
      const res = await request(app).get('/api/v1/items');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/v1/items', () => {
    it('debe retornar 201 al crear prenda con datos válidos (requiere auth)', async () => {
      const newGarment = {
        code: 'LAV-001',
        name: 'Abrigo de Lana',
        fabricType: 'Lana',
        serviceType: 'DRY_CLEAN',
        price: 45,
      };

      const res = await request(app)
        .post('/api/v1/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newGarment);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.code).toBe('LAV-001');
    });

    it('debe retornar 422 con datos inválidos (Zod validation)', async () => {
      const invalidGarment = {
        code: 'LA',
        name: '',
        price: -10,
      };

      const res = await request(app)
        .post('/api/v1/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidGarment);

      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('error', 'Error de validación');
    });

    it('debe retornar 401 si se intenta crear sin token de autenticación', async () => {
      const newGarment = {
        code: 'LAV-002',
        name: 'Camisa',
        fabricType: 'Algodón',
        serviceType: 'PRESSING',
        price: 15,
      };

      const res = await request(app).post('/api/v1/items').send(newGarment);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('debe retornar 200 con la prenda correspondiente si el ID existe', async () => {
      const created = await GarmentModel.create({
        code: 'LAV-003',
        name: 'Pantalón Vestir',
        fabricType: 'Lino',
        serviceType: 'DRY_CLEAN',
        price: 20,
      });

      const res = await request(app).get(`/api/v1/items/${created._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Pantalón Vestir');
    });

    it('debe retornar 404 si el ID no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/v1/items/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/items/:id', () => {
    it('debe retornar 200 al actualizar prenda con datos válidos', async () => {
      const created = await GarmentModel.create({
        code: 'LAV-004',
        name: 'Mantelería',
        fabricType: 'Algodón',
        serviceType: 'WASH_FOLD',
        price: 30,
      });

      const res = await request(app)
        .put(`/api/v1/items/${created._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 35 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(35);
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('debe retornar 204 al eliminar siendo ADMIN', async () => {
      const created = await GarmentModel.create({
        code: 'LAV-005',
        name: 'Chaqueta Cuero',
        fabricType: 'Cuero',
        serviceType: 'DRY_CLEAN',
        price: 60,
      });

      const res = await request(app)
        .delete(`/api/v1/items/${created._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });

    it('debe retornar 403 si un usuario sin rol ADMIN intenta eliminar', async () => {
      const created = await GarmentModel.create({
        code: 'LAV-006',
        name: 'Sábana',
        fabricType: 'Algodón',
        serviceType: 'WASH_FOLD',
        price: 12,
      });

      const res = await request(app)
        .delete(`/api/v1/items/${created._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Casos borde de Middlewares, Controllers y Repositorios (100% Coverage)', () => {
    it('debe retornar 401 si el header Authorization no usa la palabra clave Bearer', async () => {
      const res = await request(app)
        .post('/api/v1/items')
        .set('Authorization', 'Basic token_sin_bearer_123')
        .send({
          code: 'LAV-999',
          name: 'Prueba',
          fabricType: 'Lana',
          serviceType: 'DRY_CLEAN',
          price: 10,
        });

      expect(res.status).toBe(401);
    });

    it('debe retornar 401 si se envía un token JWT inválido o malformado', async () => {
      const res = await request(app)
        .post('/api/v1/items')
        .set('Authorization', 'Bearer token_completamente_invalido')
        .send({
          code: 'LAV-777',
          name: 'Prueba Token',
          fabricType: 'Lana',
          serviceType: 'DRY_CLEAN',
          price: 10,
        });

      expect(res.status).toBe(401);
    });

    it('debe capturar errores 500 inesperados en el GET controller', async () => {
      const spy = jest.spyOn(GarmentsService, 'getAll').mockRejectedValueOnce(new Error('Fallo crítico de conexión a DB'));

      const res = await request(app).get('/api/v1/items');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');

      spy.mockRestore();
    });

    it('debe capturar errores inesperados en el POST controller', async () => {
      const spy = jest.spyOn(GarmentsService, 'create').mockRejectedValueOnce(new Error('Error interno al crear'));

      const res = await request(app)
        .post('/api/v1/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          code: 'LAV-888',
          name: 'Edredón',
          fabricType: 'Plumas',
          serviceType: 'DRY_CLEAN',
          price: 50,
        });

      expect(res.status).toBe(500);

      spy.mockRestore();
    });

    it('debe capturar errores inesperados en el PUT controller', async () => {
      const created = await GarmentModel.create({
        code: 'LAV-701',
        name: 'Camisa Test',
        fabricType: 'Algodón',
        serviceType: 'PRESSING',
        price: 10,
      });

      const spy = jest.spyOn(GarmentsService, 'update').mockRejectedValueOnce(new Error('Fallo en PUT'));

      const res = await request(app)
        .put(`/api/v1/items/${created._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 15 });

      expect(res.status).toBe(500);

      spy.mockRestore();
    });

    it('debe capturar errores inesperados en el DELETE controller', async () => {
      const created = await GarmentModel.create({
        code: 'LAV-702',
        name: 'Pantalón Test',
        fabricType: 'Dril',
        serviceType: 'WASH_FOLD',
        price: 12,
      });

      const spy = jest.spyOn(GarmentsService, 'delete').mockRejectedValueOnce(new Error('Fallo en DELETE'));

      const res = await request(app)
        .delete(`/api/v1/items/${created._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(500);

      spy.mockRestore();
    });

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
    });
  });
});