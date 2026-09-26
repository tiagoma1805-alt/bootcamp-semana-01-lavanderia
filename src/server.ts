import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './lib/mongoose';

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
  });
}

start();
