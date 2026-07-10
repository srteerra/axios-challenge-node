import request from 'supertest';
import { createApp } from '../app.js';
import { resetDatabase, closeDatabase } from './helpers.js';

const app = createApp();

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Auth', () => {
  const credentials = {
    email: 'test@axiosmobile.mx',
    name: 'Test User',
    password: 'secret123',
  };

  test('registra un usuario y devuelve token', async () => {
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(credentials.email);
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  test('no permite email duplicado', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(409);
  });

  test('login con credenciales válidas devuelve token', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login con password incorrecta responde 401', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('ruta protegida sin token responde 401', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(401);
  });
});
