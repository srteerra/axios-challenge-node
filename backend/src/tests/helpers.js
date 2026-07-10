import { sequelize } from '../models/index.js';

/** Recrea el esquema antes de cada suite para aislar los tests. */
export async function resetDatabase() {
  await sequelize.sync({ force: true });
}

export async function closeDatabase() {
  await sequelize.close();
}

/**
 * Mockea global.fetch para simular respuestas de la PokeAPI sin salir a red.
 * `pokemons` es un mapa nombre/id -> objeto de pokémon (o null para 404).
 */
export function mockPokeApi(pokemons) {
  const lookup = new Map();
  for (const p of pokemons) {
    lookup.set(String(p.id), p);
    lookup.set(p.name, p);
  }

  global.fetch = async (url) => {
    const match = String(url).match(/\/pokemon\/([^/?]+)$/);
    if (match) {
      const key = decodeURIComponent(match[1]).toLowerCase();
      const found = lookup.get(key);
      if (!found) {
        return { status: 404, ok: false, json: async () => ({}) };
      }
      return {
        status: 200,
        ok: true,
        json: async () => ({
          id: found.id,
          name: found.name,
          sprites: { front_default: found.sprite ?? null },
          types: (found.types ?? []).map((t) => ({ type: { name: t } })),
        }),
      };
    }
    // Listado
    return {
      status: 200,
      ok: true,
      json: async () => ({
        count: pokemons.length,
        results: pokemons.map((p) => ({ name: p.name, url: `mock://pokemon/${p.id}` })),
      }),
    };
  };
}
