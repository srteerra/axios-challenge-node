import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Favorite {
  id: number;
  pokemonId: number;
  pokemonName: string;
  nickname: string | null;
}

interface PokemonListItem {
  name: string;
}

interface Team {
  id: number;
  name: string;
  members: TeamMember[];
}

interface TeamMember {
  id: number;
  pokemonId: number;
  pokemonName: string;
}

/**
 * Pantalla de referencia: lista pokémon de la PokeAPI (vía backend) y permite
 * marcarlos como favoritos. Es el patrón de UI que el candidato debe replicar
 * para el módulo Teams.
 */
export function Favorites() {
  const { logout } = useAuth();
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadFavorites() {
    const res = await api.get<{ data: Favorite[] }>('/favorites');
    setFavorites(res.data);
  }

  async function loadTeams() {
    const res = await api.get<{ data: Team[] }>('/teams');
    setTeams(res.data);
  }

  useEffect(() => {
    (async () => {
      try {
        const list = await api.get<{ results: PokemonListItem[] }>('/pokemon?limit=20');
        setPokemon(list.results);
        await loadFavorites();
        await loadTeams();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar');
      }
    })();
  }, []);

  const favoriteNames = new Set(favorites.map((f) => f.pokemonName));

  async function addFavorite(name: string) {
    try {
      await api.post('/favorites', { pokemon: name });
      await loadFavorites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar');
    }
  }

  async function removeFavorite(fav: Favorite) {
    await api.del(`/favorites/${fav.id}`);
    await loadFavorites();
  }

  async function createTeam() {
    try {
      const name = prompt('Nombre del nuevo equipo:');
      if (!name) return;

      const raw = prompt('Pokémon del equipo, separados por coma (máx. 6):');
      if (!raw) return;

      const members = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.post('/teams', { name, members });
      await loadTeams();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear equipo');
    }
  }

  async function removeTeam(team: Team) {
    await api.del(`/teams/${team.id}`);
    await loadTeams();
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Pokédex — Favoritos</h1>
        <button onClick={logout}>Salir</button>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <h2>Mis favoritos ({favorites.length})</h2>
      <ul>
        {favorites.map((f) => (
          <li key={f.id}>
            {f.pokemonName} {f.nickname ? `("${f.nickname}")` : ''}{' '}
            <button onClick={() => removeFavorite(f)}>quitar</button>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginBottom: 0 }}>Mis equipos ({teams.length})</h2>
        <button onClick={createTeam}>Nuevo equipo</button>
      </div>

      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} {' '}
            <button onClick={() => removeTeam(team)}>eliminar equipo</button>
            <ul>
              {team.members.map((member) => (
                <li key={member.id}>
                  {member.pokemonName}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Catálogo (PokeAPI)</h2>
      <ul>
        {pokemon.map((p) => (
          <li key={p.name}>
            {p.name}{' '}
            {favoriteNames.has(p.name) ? (
              <span style={{ color: 'green' }}>✓ favorito</span>
            ) : (
              <button onClick={() => addFavorite(p.name)}>+ favorito</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
