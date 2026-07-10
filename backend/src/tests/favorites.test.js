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
    email: 'fav@axiosmobile.mx',
    name: 'Fav Tester',
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

describe('Favoritos (módulo de referencia)', () => {
  test('crea un favorito validado contra PokeAPI', async () => {
    const token = await authToken();
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ pokemon: 'pikachu', nickname: 'Chispas' });

    expect(res.status).toBe(201);
    expect(res.body.pokemonId).toBe(25);
    expect(res.body.pokemonName).toBe('pikachu');
  });

  test('rechaza un pokémon inexistente con 422', async () => {
    const token = await authToken();
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ pokemon: 'noexiste' });

    expect(res.status).toBe(422);
  });

  test('no permite duplicar el mismo favorito (409)', async () => {
    const token = await authToken();
    await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ pokemon: 'pikachu' });
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ pokemon: 'pikachu' });

    expect(res.status).toBe(409);
  });

  test('lista, actualiza y elimina favoritos del propio usuario', async () => {
    const token = await authToken();
    const created = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ pokemon: 'charizard' });

    const list = await request(app).get('/api/favorites').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);

    const patched = await request(app)
      .patch(`/api/favorites/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: 'Draco' });
    expect(patched.body.nickname).toBe('Draco');

    const del = await request(app)
      .delete(`/api/favorites/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);
  });
});
