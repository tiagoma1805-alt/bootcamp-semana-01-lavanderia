import app from './app';
import { logger } from './config/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`🚀 SERVIDOR LISTO EN PUERTO ${PORT}`);
  console.log(`🧺 Ruta: http://localhost:${PORT}/api/v1/services`);
  console.log(`=================================\n`);
  logger.info(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});