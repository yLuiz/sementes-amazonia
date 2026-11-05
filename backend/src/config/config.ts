import * as dotenv from 'dotenv';
import { join } from 'path';

// Carrega as variáveis do .env
dotenv.config();

export default function envConfig() {
  return {
    UPLOAD_DIR: process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3333,
    ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USER: process.env.DB_USER || 'sa',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    DATABASE: process.env.DATABASE || 'database',
    DB_SSL: process.env.DB_SSL || 'false',
  }
};
