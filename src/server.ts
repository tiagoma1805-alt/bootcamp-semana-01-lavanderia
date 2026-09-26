import app from './app';
import { logger } from './config/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor ejecutándose en http://localhost:${PORT}`);
  logger.info(`Ruta de servicios: http://localhost:${PORT}/api/v1/services`);
});