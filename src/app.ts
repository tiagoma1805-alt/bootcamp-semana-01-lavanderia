import express from 'express';
import authRoutes from './routes/auth.routes';
import garmentsRoutes from './routes/garments.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/items', garmentsRoutes);

app.use(errorHandler);

export default app;