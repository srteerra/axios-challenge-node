import request from 'supertest';
import { createApp } from '../app.js';
import { resetDatabase, closeDatabase, mockPokeApi } from './helpers.js';

const app = createApp();

const POKEMONS = [
  { id: 25, name: 'pikachu', sprite: 'pika.png', types: ['electric'] },
  { id: 6, name: 'charizard', sprite: 'char.png', types: ['fire', 'flying'] },
];

async function authToken() {
  const res = await request(app).post('/api/auth/register').send({
    email: 'teams@axiosmobile.mx',
    name: 'Teams Tester',
    password: 'secret123',
  });
  return res.body.token;
}

beforeEach(async () => {
  await resetDatabase();
  mockPokeApi(POKEMONS);
});

afterAll(async () => {
  await closeDatabase();
});

describe('Equipos (Teams)', () => {
  test('crea un equipo válido con sus miembros validados contra PokeAPI', async () => {
    const token = await authToken();

    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Starters', members: ['pikachu', 'charizard'] });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Starters');

    const list = await request(app)
      .get('/api/teams')
      .set('Authorization', `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);

    const [team] = list.body.data;
    expect(team.name).toBe('Starters');
    expect(team.members).toHaveLength(2);
    expect(team.members.map((m) => m.pokemonName).sort()).toEqual(['charizard', 'pikachu']);
  });
});
