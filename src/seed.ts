import { connectDB } from './lib/mongoose';
import { CategoryModel } from './models/category.model';
import { ServiceModel } from './models/service.model';
import mongoose from 'mongoose';

async function seed() {
  try {
    await connectDB();
    console.log('🌱 Poblando la base de datos de Lavandería...');

    await ServiceModel.deleteMany({});
    await CategoryModel.deleteMany({});

    const categories = await CategoryModel.insertMany([
      { name: 'Lavado al Seco', description: 'Tratamiento delicado para trajes y vestidos' },
      { name: 'Lavado por Kilo', description: 'Ropa de uso diario por volumen' },
      { name: 'Planchado & Almidonado', description: 'Acabado para camisas y pantalones' },
    ]);

    console.log(`✅ ${categories.length} categorías creadas.`);

    const services = await ServiceModel.insertMany([
      { name: 'Terno Completo 2 Piezas', price: 25000, estimatedHours: 24, category: categories[0]._id },
      { name: 'Vestido de Gala', price: 35000, estimatedHours: 48, category: categories[0]._id },
      { name: 'Carga de Ropa x 8Kg', price: 18000, estimatedHours: 12, category: categories[1]._id },
      { name: 'Planchado de Camisa', price: 6000, estimatedHours: 6, category: categories[2]._id },
    ]);

    console.log(`✅ ${services.length} servicios creados exitosamente.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
