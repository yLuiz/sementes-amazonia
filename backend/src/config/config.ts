import * as dotenv from 'dotenv';

// Carrega as variáveis do .env
dotenv.config();

export default function envConfig() {
  return {
    MODE: process.env.MODE || 'dev',
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3333,
    API_JWT_SECRET: process.env.API_JWT_SECRET || 'secret-key',
    API_JWT_EXPIRES_IN: process.env.API_JWT_EXPIRES_IN || '24h',
    API_CORE_URL: process.env.API_CORE_URL,
    CORE_MODULE_NAME: process.env.CORE_MODULE_NAME || 'SMART_ROUTER',
    SMTP_EMAIL: process.env.SMTP_EMAIL || 'any',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '123456',
    IS_PROD: process.env.MODE === 'prod' ? true : false, // if this variable is not set, default is TRUE;
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USER: process.env.DB_USER || 'sa',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    DATABASE: process.env.DATABASE || 'database',
    ENABLE_REQUEST_LOGS: process.env.ENABLE_REQUEST_LOGS || true,
    DB_SSL: process.env.DB_SSL || 'false',
    RABBITMQ_URI: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
  }
};