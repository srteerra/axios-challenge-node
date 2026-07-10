import { DataTypes, Model } from 'sequelize';

/**
 * MÓDULO DE REFERENCIA — Favorito.
 *
 * Representa un pokémon que un usuario guardó como favorito. Es el patrón
 * que el candidato debe imitar (no copiar) para construir el módulo Teams.
 *
 * Un usuario no puede tener el mismo pokémon dos veces (índice único
 * compuesto user_id + pokemon_id).
 */
export class Favorite extends Model {}

export function initFavoriteModel(sequelize) {
  Favorite.init(
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
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'favorites',
      indexes: [{ unique: true, fields: ['user_id', 'pokemon_id'] }],
    },
  );

  return Favorite;
}
