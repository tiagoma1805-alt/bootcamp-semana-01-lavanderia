import { GarmentsService } from '../services/garments.service';
import { GarmentsRepository } from '../repositories/garments.repository';
import { AppError } from '../errors/AppError';

jest.mock('../repositories/garments.repository');

describe('GarmentsService (Lavandería) Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll()', () => {
    it('debe retornar todas las prendas registadas (happy path)', async () => {
      const mockGarments = [
        { code: 'GAR-001', name: 'Traje Ejecutivo', fabricType: 'Lana', serviceType: 'DRY_CLEAN', price: 25 },
      ];
      (GarmentsRepository.findAll as jest.Mock).mockResolvedValue(mockGarments);

      const result = await GarmentsService.getAll();

      expect(GarmentsRepository.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockGarments);
    });

    it('debe filtrar las prendas por tipo de servicio si aplica', async () => {
      const mockGarments = [
        { code: 'GAR-002', name: 'Camisa Algodón', fabricType: 'Algodón', serviceType: 'WASH_FOLD', price: 10 },
      ];
      (GarmentsRepository.findAll as jest.Mock).mockResolvedValue(mockGarments);

      const result = await GarmentsService.getAll('WASH_FOLD');

      expect(GarmentsRepository.findAll).toHaveBeenCalledWith({ serviceType: 'WASH_FOLD' });
      expect(result).toEqual(mockGarments);
    });
  });

  describe('getById()', () => {
    it('debe retornar la prenda correspondiente al ID', async () => {
      const mockGarment = { _id: '123', code: 'GAR-001', name: 'Saco' };
      (GarmentsRepository.findById as jest.Mock).mockResolvedValue(mockGarment);

      const result = await GarmentsService.getById('123');

      expect(GarmentsRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockGarment);
    });

    it('debe lanzar AppError 404 si la prenda no existe', async () => {
      (GarmentsRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(GarmentsService.getById('999'))
        .rejects
        .toThrow(new AppError(404, 'Prenda no encontrada'));
    });
  });

  describe('create()', () => {
    it('debe crear una prenda con datos válidos', async () => {
      const newGarment = {
        code: 'GAR-100',
        name: 'Vestido de Seda',
        fabricType: 'Seda',
        serviceType: 'DRY_CLEAN' as const,
        price: 35,
      };

      (GarmentsRepository.findByCode as jest.Mock).mockResolvedValue(null);
      (GarmentsRepository.create as jest.Mock).mockResolvedValue({ _id: 'generated-id', ...newGarment });

      const result = await GarmentsService.create(newGarment);

      expect(GarmentsRepository.findByCode).toHaveBeenCalledWith('GAR-100');
      expect(result).toHaveProperty('_id');
      expect(result.code).toBe('GAR-100');
    });

    it('debe lanzar error 409 si el código de prenda ya existe', async () => {
      const garmentData = {
        code: 'GAR-100',
        name: 'Vestido de Seda',
        fabricType: 'Seda',
        serviceType: 'DRY_CLEAN' as const,
        price: 35,
      };

      (GarmentsRepository.findByCode as jest.Mock).mockResolvedValue({ _id: 'existing-id', ...garmentData });

      await expect(GarmentsService.create(garmentData))
        .rejects
        .toThrow(new AppError(409, 'El código de prenda ya existe'));
    });
  });

  describe('update()', () => {
    it('debe actualizar una prenda existente', async () => {
      const updateData = { price: 40 };
      const updatedGarment = { _id: '123', code: 'GAR-100', price: 40 };

      (GarmentsRepository.update as jest.Mock).mockResolvedValue(updatedGarment);

      const result = await GarmentsService.update('123', updateData);

      expect(GarmentsRepository.update).toHaveBeenCalledWith('123', updateData);
      expect(result.price).toBe(40);
    });

    it('debe lanzar AppError 404 si la prenda a actualizar no existe', async () => {
      (GarmentsRepository.update as jest.Mock).mockResolvedValue(null);

      await expect(GarmentsService.update('999', { price: 40 }))
        .rejects
        .toThrow(new AppError(404, 'Prenda no encontrada'));
    });
  });

  describe('delete()', () => {
    it('debe eliminar la prenda por ID', async () => {
      const deletedGarment = { _id: '123', code: 'GAR-100' };
      (GarmentsRepository.delete as jest.Mock).mockResolvedValue(deletedGarment);

      const result = await GarmentsService.delete('123');

      expect(GarmentsRepository.delete).toHaveBeenCalledWith('123');
      expect(result).toEqual(deletedGarment);
    });

    it('debe lanzar AppError 404 si la prenda a eliminar no existe', async () => {
      (GarmentsRepository.delete as jest.Mock).mockResolvedValue(null);

      await expect(GarmentsService.delete('999'))
        .rejects
        .toThrow(new AppError(404, 'Prenda no encontrada'));
    });
  });
});