import { DataTypes, Model } from 'sequelize';

/**
 * TeamMember — un pokémon que forma parte de un equipo (Team).
 *
 * Persiste el id y el nombre que devuelve la PokeAPI (`pokemonId` /
 * `pokemonName`). Cada miembro pertenece a un equipo (`teamId`).
 */
export class TeamMember extends Model {}

export function initTeamMemberModel(sequelize) {
  TeamMember.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pokemonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pokemonName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TeamMember',
      tableName: 'team_members',
    },
  );

  return TeamMember;
}
