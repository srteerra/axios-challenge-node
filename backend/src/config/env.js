import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuración centralizada leída desde variables de entorno.
 * Se valida lo mínimo indispensable para fallar rápido si falta algo.
 */
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  jwt: {
    secret: process.env.JWT_SECRET || 'insecure-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  db: {
    // En entorno de test usamos una BD en memoria para no ensuciar el disco.
    storage: process.env.NODE_ENV === 'test' ? ':memory:' : process.env.DB_STORAGE || './data/dev.sqlite',
  },
  pokeapi: {
    baseUrl: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
  },
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim()),
};

if (config.env === 'production' && config.jwt.secret === 'insecure-dev-secret') {
  throw new Error('JWT_SECRET debe definirse explícitamente en producción.');
}
