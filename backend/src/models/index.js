import { sequelize } from '../config/database.js';
import { initUserModel } from './user.model.js';
import { initFavoriteModel } from './favorite.model.js';

const User = initUserModel(sequelize);
const Favorite = initFavoriteModel(sequelize);

// Asociaciones
// Un usuario tiene muchos favoritos; cada favorito pertenece a un usuario.
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// NOTA PARA EL CANDIDATO:
// Aquí es donde registrarás e inicializarás los modelos Team / TeamMember
// y sus asociaciones (User hasMany Team, Team hasMany TeamMember).

export { sequelize, User, Favorite };
