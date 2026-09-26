import express from 'express';
import { categoryRoutes } from './routes/category.routes';
import { serviceRoutes } from './routes/service.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

app.use(express.json());

app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/services', serviceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
