import { createApp } from './app.js';
import { sequelize } from './models/index.js';
import { config } from './config/env.js';

async function start() {
  try {
    await sequelize.authenticate();
    // En el reto usamos sync automático para simplicidad (no migraciones).
    await sequelize.sync();
    console.log('✔ Base de datos SQLite conectada y sincronizada');

    const app = createApp();
    app.listen(config.port, () => {
      console.log(`✔ API escuchando en http://localhost:${config.port}`);
      console.log(`  Entorno: ${config.env}`);
    });
  } catch (error) {
    console.error('✖ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

start();
