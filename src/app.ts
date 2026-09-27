import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import orderRouter from './routes/order.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Rutas de la API (Deben ir ANTES de notFound)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', orderRouter);

// Manejo de errores y 404 (Siempre al final)
app.use(notFound);
app.use(errorHandler);

export default app;
