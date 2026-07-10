import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Sequelize } from 'sequelize';
import { config } from './env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '..', '..');

// Resolvemos la ruta del archivo SQLite y garantizamos que el directorio exista.
const storage =
  config.db.storage === ':memory:'
    ? ':memory:'
    : path.resolve(backendRoot, config.db.storage);

if (storage !== ':memory:') {
  fs.mkdirSync(path.dirname(storage), { recursive: true });
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: config.env === 'development' ? console.log : false,
  define: {
    // Nombres de tabla en snake_case y timestamps automáticos.
    underscored: true,
  },
});
