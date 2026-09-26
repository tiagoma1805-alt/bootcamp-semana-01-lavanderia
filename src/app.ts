import express, { Application } from 'express';
import cors from 'cors';
import servicesRouter from './routes/services.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/services', servicesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;