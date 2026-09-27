import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { UserModel } from './models/user.model';
import { LaundryServiceModel } from './models/item.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lavanderia_db';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Conectado a MongoDB para sembrar datos...');

    await UserModel.deleteMany({});
    await LaundryServiceModel.deleteMany({});

    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedClientPassword = await bcrypt.hash('cliente123', 10);

    const admin = await UserModel.create({
      name: 'Administrador Lavandería',
      email: 'admin@lavanderia.com',
      password: hashedAdminPassword,
      role: 'admin'
    });

    const client = await UserModel.create({
      name: 'Cliente Registrado',
      email: 'cliente@lavanderia.com',
      password: hashedClientPassword,
      role: 'client'
    });

    console.log('✅ Usuarios creados: Admin y Cliente');

    const services = await LaundryServiceModel.create([
      {
        serviceCode: 'LAV-001',
        name: 'Lavado por Kilo de Ropa Blanca',
        category: 'lavado',
        price: 18.50,
        estimatedHours: 24,
        isActive: true,
        createdBy: admin._id
      },
      {
        serviceCode: 'TIN-001',
        name: 'Tintorería y Limpieza de Traje Completo',
        category: 'tintoreria',
        price: 45.00,
        estimatedHours: 48,
        isActive: true,
        createdBy: admin._id
      },
      {
        serviceCode: 'PLA-001',
        name: 'Planchado de Camisas por Ciento',
        category: 'planchado',
        price: 25.00,
        estimatedHours: 12,
        isActive: true,
        createdBy: client._id
      }
    ]);

    console.log(`✅ ${services.length} servicios de lavandería creados.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
}

seed();
