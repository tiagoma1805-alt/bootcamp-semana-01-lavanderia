import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor de Lavandería activo en http://localhost:${PORT}`);
  console.log(`📋 Rutas API en http://localhost:${PORT}/api/v1/orders`);
});

// Graceful Shutdown
const handleGracefulShutdown = (signal: string) => {
  console.log(`\n⚠️  Señal ${signal} recibida. Apagando servidor...`);

  server.close(() => {
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('❌ Forzando apagado por tiempo agotado.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));