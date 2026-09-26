import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cargando datos iniciales para Lavandería y Tintorería...');

  // 1. Categorías
  const catSeco = await prisma.category.upsert({
    where: { name: 'Tintorería y Lavado en Seco' },
    update: {},
    create: {
      name: 'Tintorería y Lavado en Seco',
      description: 'Lavado especializado para prendas delicadas y ternos.',
    },
  });

  const catAgua = await prisma.category.upsert({
    where: { name: 'Lavado al Agua' },
    update: {},
    create: {
      name: 'Lavado al Agua',
      description: 'Servicio de lavandería por kilo y prendas de cama.',
    },
  });

  const catPlanchado = await prisma.category.upsert({
    where: { name: 'Planchado y Vapor' },
    update: {},
    create: {
      name: 'Planchado y Vapor',
      description: 'Planchado profesional individual a vapor.',
    },
  });

  const catEspecial = await prisma.category.upsert({
    where: { name: 'Tratamiento Especial' },
    update: {},
    create: {
      name: 'Tratamiento Especial',
      description: 'Teñido y remoción de manchas difíciles.',
    },
  });

  // 2. Servicios principales (mínimo 5 registros)
  const services = [
    {
      code: 'LAV-001',
      name: 'Lavado por Kilo',
      description: 'Ropa diaria lavada, secada y doblada.',
      price: 12.50,
      estimatedHours: 24,
      isAvailable: true,
      categoryId: catAgua.id,
    },
    {
      code: 'SEC-001',
      name: 'Limpieza en Seco Traje 2 Piezas',
      description: 'Saco y pantalón de vestir.',
      price: 25.00,
      estimatedHours: 48,
      isAvailable: true,
      categoryId: catSeco.id,
    },
    {
      code: 'SEC-002',
      name: 'Limpieza en Seco Vestido de Fiesta',
      description: 'Vestidos de noche o con pedrería.',
      price: 35.00,
      estimatedHours: 48,
      isAvailable: true,
      categoryId: catSeco.id,
    },
    {
      code: 'PLN-001',
      name: 'Planchado de Camisa/Blusa',
      description: 'Planchado individual entregado en gancho.',
      price: 5.50,
      estimatedHours: 12,
      isAvailable: true,
      categoryId: catPlanchado.id,
    },
    {
      code: 'ESP-001',
      name: 'Teñido de Jeans',
      description: 'Renovación de color negro o azul.',
      price: 18.00,
      estimatedHours: 72,
      isAvailable: true,
      categoryId: catEspecial.id,
    },
    {
      code: 'ESP-002',
      name: 'Desmanchado Especial de Abrigos',
      description: 'Tratamiento localizado para grasa o vino.',
      price: 20.00,
      estimatedHours: 24,
      isAvailable: false,
      categoryId: catEspecial.id,
    },
  ];

  for (const item of services) {
    await prisma.service.upsert({
      where: { code: item.code },
      update: item,
      create: item,
    });
  }

  console.log('✅ Seed finalizado correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });