import 'dotenv/config';
import { test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';

import { hashPassword } from '#utils/password';
import { prisma } from '../src/db/prisma.js';
import { runIntegration, setupIntegrationApp, resetDatabase } from './helpers/integration.js';

const itIfIntegration = runIntegration ? test : test.skip;

/**
 * Helper that creates a fresh app instance with empty repos.
 */
const setup = async () => {
  const { app, repos } = setupIntegrationApp();
  return { app, repos };
};

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

/* Happy path  for register & login */
itIfIntegration('register & login (happy path)', async () => {
  const { app } = await setup();

  // Register
  const res1 = await request(app)
    .post('/auth/register')
    .send({ email: 'test@user.com', password: 'secret' });

  expect(res1.status).toBe(201);
  expect(res1.body.ok).toBe(true);
  expect(res1.body.data.token).toBeDefined();

  // Login
  const res2 = await request(app)
    .post('/auth/login')
    .send({ email: 'test@user.com', password: 'secret' });

  expect(res2.status).toBe(200);
  expect(res2.body.ok).toBe(true);
  expect(res2.body.data.token).toBeDefined();
});

/* Error – validation (missing fields) */
itIfIntegration('register fails without email/password', async () => {
  const { app } = await setup();

  const res = await request(app).post('/auth/register').send({}); // missing email & password

  expect(res.status).toBe(400);
  expect(res.body.ok).toBe(false);
});

/* Error – duplicate email */
itIfIntegration('register fails if email already exists', async () => {
  const { app, repos } = await setup();

  // existing user
  const password = await hashPassword('secret');
  await repos.users.create({ id: '11111111-1111-4111-8111-111111111111', email: 'a@b.c', password });

  const res = await request(app)
    .post('/auth/register')
    .send({ email: 'a@b.c', password: 'secret' });

  expect(res.status).toBe(409);
  expect(res.body.ok).toBe(false);
});

/* Error – invalid credentials */
itIfIntegration('login fails with wrong password', async () => {
  const { app, repos } = await setup();

  const password = await hashPassword('secret');
  await repos.users.create({ id: '22222222-2222-4222-8222-222222222222', email: 'a@b.c', password });

  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'a@b.c', password: 'wrong-password' });

  expect(res.status).toBe(401);
  expect(res.body.ok).toBe(false);
});
