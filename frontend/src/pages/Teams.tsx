import { useEffect, useState } from 'react';
import { api } from '../api/client';

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
 * Pantalla del módulo Teams: lista los equipos del usuario y permite crearlos,
 * editarlos y eliminarlos. Replica el patrón de UI de la pantalla de Favoritos.
 */
export function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadTeams() {
    const res = await api.get<{ data: Team[] }>('/teams');
    setTeams(res.data);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadTeams();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar');
      }
    })();
  }, []);

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

  async function updateTeam(team: Team) {
    try {
      const name = prompt('Nuevo nombre del equipo:', team.name);
      if (name === null) return;

      const raw = prompt(
        'Pokémon del equipo, separados por coma (máx. 6):',
        team.members.map((m) => m.pokemonName).join(', '),
      );

      if (raw === null) return;

      const members = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: { name?: string; members?: string[] } = {};

      if (name.trim()) payload.name = name.trim();
      if (members.length > 0) payload.members = members;

      await api.patch(`/teams/${team.id}`, payload);
      await loadTeams();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar equipo');
    }
  }

  async function removeTeam(team: Team) {
    if (!confirm(`¿Seguro que quieres eliminar el equipo "${team.name}"?`)) return;
    await api.del(`/teams/${team.id}`);
    await loadTeams();
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Pokédex — Equipos</h1>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginBottom: 0 }}>Mis equipos ({teams.length})</h2>
        <button onClick={createTeam}>Nuevo equipo</button>
      </div>

      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} {' '}
            <button onClick={() => updateTeam(team)}>editar</button>{' '}
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
    </div>
  );
}
