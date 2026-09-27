import 'dotenv/config'; // <-- ¡Esta línea DEBE ser la primera!
import app from './app';
import { connectDB } from './lib/mongoose';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();