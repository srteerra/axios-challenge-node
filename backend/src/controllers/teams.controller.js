import { asyncHandler } from '../utils/async-handler.js';
import { HttpError } from '../utils/http-error.js';
import * as pokeapi from '../services/pokeapi.service.js';
import { sequelize, Team, TeamMember } from '../models/index.js';

/**
 * Valida una lista de miembros contra la PokeAPI y devuelve las especies (id + nombre).
 * Tambien aplica las reglas de máximo 6 y sin duplicados.
 * Reutilizado por createTeam y updateTeam.
 */
async function resolveSpecies(members) {
  if (members.length > 6) {
    throw HttpError.unprocessable("Un equipo no puede tener más de 6 Pokémon");
  }

  const species = [];
  for (const member of members) {
    const { id, name } = await pokeapi.assertSpeciesExists(member);
    species.push({ id, name });
  }

  if (new Set(species.map((s) => s.id)).size !== species.length) {
    throw HttpError.conflict("No se pueden repetir especies en un equipo");
  }

  return species;
}

/** POST /api/teams — crea un equipo (valida contra PokeAPI). */
export const createTeam = asyncHandler(async (req, res) => {
  const { name, members } = req.body;

  if (!name || !String(name).trim()) throw HttpError.badRequest("El nombre del equipo es obligatorio");

  if (!Array.isArray(members) || members.length === 0) {
    throw HttpError.badRequest("La lista de Pokémon no puede estar vacía");
  }

  const species = await resolveSpecies(members);

  const resp = await sequelize.transaction(async (t) => {
    const team = await Team.create({ userId: req.user.id, name }, { transaction: t });
    await TeamMember.bulkCreate(species.map((specie) => ({
      teamId: team.id,
      pokemonId: specie.id,
      pokemonName: specie.name
    })), { transaction: t });

    return team.reload({ transaction: t });
  })

  res.status(201).json(resp);
});

/** GET /api/teams — devuelve listado de equipos con la lista de TeamMembers. */
export const listTeams = asyncHandler(async (req, res) => {
  const teams = await Team.findAll({
    where: { userId: req.user.id },
    include: [{ association: 'members' }],
    order: [['created_at', 'DESC']],
  });

  res.json({ data: teams });
});

/** GET /api/teams/:id — devuelve el equipo deseado por ID y con la lista de los TeamMembers similar a listTeams. */
export const getTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{ association: 'members' }],
  });

  if (!team) {
    throw HttpError.notFound('Equipo no encontrado');
  }

  res.json(team);
});

/** PATCH /api/teams/:id — actualización del equipo en base a un cambio de nombre y/o TeamMembers. */
export const updateTeam = asyncHandler(async (req, res) => {
  const { name, members } = req.body;

  const team = await Team.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!team) {
    throw HttpError.notFound('Equipo no encontrado');
  }

  if (name && String(name).trim()) {
    team.name = name;
  }

  const species = Array.isArray(members) ? await resolveSpecies(members) : null;

  await sequelize.transaction(async (t) => {
    await team.save({ transaction: t });

    if (species) {
      await TeamMember.destroy({ where: { teamId: team.id }, transaction: t });
      await TeamMember.bulkCreate(species.map((specie) => ({
        teamId: team.id,
        pokemonId: specie.id,
        pokemonName: specie.name
      })), { transaction: t });
    }
  });

  await team.reload({ include: [{ association: 'members' }] });
  res.json(team);
});

/** DELETE /api/teams/:id — elimina el equipo deseado. */
export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!team) {
    throw HttpError.notFound('Equipo no encontrado');
  }

  await team.destroy();
  res.status(204).send();
});
