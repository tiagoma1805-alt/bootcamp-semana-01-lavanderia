import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { helmetMiddleware, corsMiddleware, apiLimiter, mongoSanitizeMiddleware } from './config/security';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import itemRoutes from './routes/item.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Capas de Seguridad
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(apiLimiter);
app.use(express.json({ limit: '10kb' })); // Previene payloads masivos
app.use(mongoSanitizeMiddleware);

// Rutas Principales
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/items', itemRoutes);

// Manejo centralizado de errores (oculta el stack trace en producción)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Conexión a MongoDB y arranque del servidor
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lavanderia_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Exitosamente');
    app.listen(PORT, () => {
      console.log(`🚀 API de Lavandería corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
  });
