import { Favorite } from '../models/index.js';
import * as pokeapi from '../services/pokeapi.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { HttpError } from '../utils/http-error.js';

/**
 * MÓDULO DE REFERENCIA — Controlador de Favoritos.
 *
 * Nota de diseño: todas las operaciones están *scopeadas* al usuario
 * autenticado (`req.user.id`). Un usuario nunca puede ver ni modificar los
 * favoritos de otro. El candidato debe replicar este patrón de "ownership"
 * en el módulo Teams.
 */

/** GET /api/favorites — lista los favoritos del usuario autenticado. */
export const listFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.findAll({
    where: { userId: req.user.id },
    order: [['created_at', 'DESC']],
  });
  res.json({ data: favorites });
});

/** POST /api/favorites — agrega un favorito (valida contra PokeAPI). */
export const createFavorite = asyncHandler(async (req, res) => {
  const { pokemon, nickname } = req.body;
  if (!pokemon) {
    throw HttpError.badRequest('El campo "pokemon" (nombre o id) es obligatorio');
  }

  // Valida que la especie exista y obtiene su id + nombre canónico.
  const species = await pokeapi.assertSpeciesExists(pokemon);

  const existing = await Favorite.findOne({
    where: { userId: req.user.id, pokemonId: species.id },
  });
  if (existing) {
    throw HttpError.conflict(`"${species.name}" ya está en tus favoritos`);
  }

  const favorite = await Favorite.create({
    userId: req.user.id,
    pokemonId: species.id,
    pokemonName: species.name,
    nickname: nickname ?? null,
  });

  res.status(201).json(favorite);
});

/** PATCH /api/favorites/:id — actualiza el nickname de un favorito. */
export const updateFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!favorite) {
    throw HttpError.notFound('Favorito no encontrado');
  }

  favorite.nickname = req.body.nickname ?? null;
  await favorite.save();
  res.json(favorite);
});

/** DELETE /api/favorites/:id — elimina un favorito. */
export const deleteFavorite = asyncHandler(async (req, res) => {
  const deleted = await Favorite.destroy({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!deleted) {
    throw HttpError.notFound('Favorito no encontrado');
  }
  res.status(204).send();
});
