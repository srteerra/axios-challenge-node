import { asyncHandler } from '../utils/async-handler.js';
import { HttpError } from '../utils/http-error.js';
import * as pokeapi from '../services/pokeapi.service.js';
import {sequelize, Team, TeamMember} from '../models/index.js';

/** POST /api/teams — crea un equipo (valida contra PokeAPI). */
export const createTeam = asyncHandler(async (req, res) => {
  const { name, members } = req.body;

  if (!name || !String(name).trim()) throw HttpError.badRequest("El nombre del equipo es obligatorio");

  if (!Array.isArray(members) || members.length === 0) {
    throw HttpError.badRequest("La lista de Pokémon no puede estar vacía");
  }

  if (members.length > 6) {
    throw HttpError.unprocessable("Un equipo no puede tener más de 6 Pokémon");
  }

  const species = [];

  for (const member of members) {
    const { id, name: pokemonName } = await pokeapi.assertSpeciesExists(member);
    species.push({ id, name: pokemonName })
  }

  const uniqueSpecies = new Set(species.map(s => s.id));
  if (uniqueSpecies.size !== species.length) {
    throw HttpError.conflict("No se pueden repetir especies en un equipo");
  }

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
