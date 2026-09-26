import express, { Application, Request, Response, NextFunction } from 'express';
import orderRoutes from './routes/items.routes';

const app: Application = express();

// Middleware 1: Body parser
app.use(express.json());

// Middleware 2: Logger personalizado
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[LOGGER] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Middleware 3: Rutas de la API
app.use('/api/v1/orders', orderRoutes);

// Middleware 4: Manejador 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'El recurso o endpoint solicitado no existe'
  });
});

// Middleware 5: Error handler global (4 parámetros)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[GLOBAL ERROR]', err.stack || err.message);
  res.status(500).json({
    error: 'Error Interno del Servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;