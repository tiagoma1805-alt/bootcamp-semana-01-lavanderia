import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

export const env = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry_test',
};