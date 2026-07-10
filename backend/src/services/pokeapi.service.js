import { config } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

/**
 * Servicio de integración con la PokeAPI (https://pokeapi.co/docs/v2).
 *
 * REUTILIZABLE POR EL CANDIDATO: el módulo Teams debe validar las especies
 * contra la PokeAPI usando `assertSpeciesExists` / `getPokemon`, en lugar de
 * reimplementar el consumo de la API.
 *
 * Incluye una caché en memoria muy simple para no golpear la PokeAPI de más
 * (es pública y pide un uso razonable). En producción esto sería Redis o
 * similar, pero para el reto basta con un Map con TTL.
 */
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.storedAt > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key, value) {
  cache.set(key, { value, storedAt: Date.now() });
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new HttpError(502, 'No se pudo contactar la PokeAPI', { url });
  }

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new HttpError(502, `PokeAPI respondió ${response.status}`, { url });
  }
  return response.json();
}

/**
 * Devuelve un listado paginado de pokémon (name + url).
 * @param {{ limit?: number, offset?: number }} params
 */
export async function listPokemon({ limit = 20, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const cacheKey = `list:${safeLimit}:${safeOffset}`;

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await fetchJson(
    `${config.pokeapi.baseUrl}/pokemon?limit=${safeLimit}&offset=${safeOffset}`,
  );
  setCached(cacheKey, data);
  return data;
}

/**
 * Devuelve el detalle de un pokémon por nombre o id.
 * Retorna `null` si no existe (404 en la PokeAPI).
 * @param {string|number} nameOrId
 */
export async function getPokemon(nameOrId) {
  const key = String(nameOrId).toLowerCase().trim();
  const cacheKey = `pokemon:${key}`;

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await fetchJson(`${config.pokeapi.baseUrl}/pokemon/${encodeURIComponent(key)}`);
  if (!data) return null;

  const simplified = {
    id: data.id,
    name: data.name,
    sprite: data.sprites?.front_default ?? null,
    types: (data.types || []).map((t) => t.type.name),
  };
  setCached(cacheKey, simplified);
  return simplified;
}

/**
 * Verifica que una especie exista en la PokeAPI. Lanza 422 si no existe.
 * Devuelve el pokémon simplificado para poder persistir id + nombre canónico.
 * @param {string|number} nameOrId
 */
export async function assertSpeciesExists(nameOrId) {
  const pokemon = await getPokemon(nameOrId);
  if (!pokemon) {
    throw HttpError.unprocessable(`El pokémon "${nameOrId}" no existe en la PokeAPI`);
  }
  return pokemon;
}
