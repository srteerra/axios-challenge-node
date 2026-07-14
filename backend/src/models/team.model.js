import { DataTypes, Model } from 'sequelize';

/**
 * Team — un equipo Pokémon que pertenece a un usuario.
 *
 * Análogo a Favorite, pero con reglas de negocio propias: agrupa hasta 6
 * miembros (TeamMember). El ownership se garantiza por `userId` y todas las
 * queries del módulo filtran por el usuario autenticado.
 */
export class Team extends Model {}

export function initTeamModel(sequelize) {
  Team.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'teams',
    },
  );

  return Team;
}
