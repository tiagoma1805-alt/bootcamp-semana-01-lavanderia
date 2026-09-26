import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor (Capas) activo en http://localhost:${PORT}`);
  console.log(`📋 API disponible en http://localhost:${PORT}/api/v1/orders`);
});

const handleShutdown = (signal: string) => {
  console.log(`\n⚠️  Recibido ${signal}. Cerrando servidor...`);
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));