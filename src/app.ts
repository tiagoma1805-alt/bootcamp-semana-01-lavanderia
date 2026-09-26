import express, { Application, Request, Response, NextFunction } from 'express';
import orderRoutes from './routes/orders.routes';

const app: Application = express();

app.use(express.json());

// Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[LOGGER] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Rutas principales
app.use('/api/v1/orders', orderRoutes);

// Manejador 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Ruta no encontrada'
  });
});

// Manejador Global de Errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

export default app;