import * as pokeapi from '../services/pokeapi.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { HttpError } from '../utils/http-error.js';

/** GET /api/pokemon?limit&offset — listado paginado (proxy de PokeAPI). */
export const listHandler = asyncHandler(async (req, res) => {
  const data = await pokeapi.listPokemon({
    limit: req.query.limit,
    offset: req.query.offset,
  });
  res.json(data);
});

/** GET /api/pokemon/:name — detalle simplificado de un pokémon. */
export const detailHandler = asyncHandler(async (req, res) => {
  const pokemon = await pokeapi.getPokemon(req.params.name);
  if (!pokemon) {
    throw HttpError.notFound(`Pokémon "${req.params.name}" no encontrado`);
  }
  res.json(pokemon);
});
