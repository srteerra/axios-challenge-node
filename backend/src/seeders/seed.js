import bcrypt from 'bcryptjs';
import { sequelize, User, Favorite } from '../models/index.js';

/**
 * Semilla de datos para tener un entorno operable de inmediato:
 * un usuario demo y un par de favoritos.
 *
 * Credenciales demo:
 *   email:    demo@axiosmobile.mx
 *   password: demo1234
 */
async function seed() {
  await sequelize.sync({ force: true }); // recrea el esquema desde cero
  console.log('✔ Esquema recreado');

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const user = await User.create({
    email: 'demo@axiosmobile.mx',
    name: 'Usuario Demo',
    passwordHash,
  });

  await Favorite.bulkCreate([
    { userId: user.id, pokemonId: 25, pokemonName: 'pikachu', nickname: 'Chispas' },
    { userId: user.id, pokemonId: 6, pokemonName: 'charizard', nickname: null },
  ]);

  console.log('✔ Usuario demo creado: demo@axiosmobile.mx / demo1234');
  console.log('✔ Favoritos de ejemplo creados');
  await sequelize.close();
}

seed().catch((error) => {
  console.error('✖ Error al ejecutar el seed:', error);
  process.exit(1);
});
