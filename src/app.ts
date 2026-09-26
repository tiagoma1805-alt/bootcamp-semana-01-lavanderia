import express from 'express';
import { morganMiddleware } from './config/logger';
import servicesRoutes from './routes/services.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(morganMiddleware);

// Endpoint principal
app.use('/api/v1/services', servicesRoutes);

// Middlewares de errores
app.use(notFound);
app.use(errorHandler);

export default app;