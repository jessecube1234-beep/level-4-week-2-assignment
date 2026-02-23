import 'dotenv/config';
import { test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';

import { hashPassword } from '#utils/password';
import { signToken } from '#utils/jwt';
import { prisma } from '../src/db/prisma.js';
import { runIntegration, setupIntegrationApp, resetDatabase } from './helpers/integration.js';

const itIfIntegration = runIntegration ? test : test.skip;

/**
 * Helper that creates an app instance and a signed token for a single user.
 */
const setup = async () => {
  const { app, repos } = setupIntegrationApp();

  // Create a dummy user
  const password = await hashPassword('secret');
  const userId = '11111111-1111-4111-8111-111111111111';
  await repos.users.create({ id: userId, email: 'a@b.c', password });

  const token = signToken({ userId });
  return { app, token };
};

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

/* Happy path – create & list projects      */
itIfIntegration('create & list projects (happy path)', async () => {
  const { app, token } = await setup();

  // ---- Create a project
  const res1 = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'My Project' });

  expect(res1.status).toBe(201);
  expect(res1.body.ok).toBe(true);
  expect(res1.body.data.title).toBe('My Project');
  expect(res1.body.data.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );

  // ---- List projects
  const res2 = await request(app).get('/projects');
  expect(res2.status).toBe(200);
  expect(Array.isArray(res2.body.data)).toBe(true);
  expect(res2.body.data.length).toBe(1);
});

/* Error – validation (missing title)       */
itIfIntegration('create project fails without title', async () => {
  const { app, token } = await setup();

  const res = await request(app).post('/projects').set('Authorization', `Bearer ${token}`).send({}); // no title

  expect(res.status).toBe(400);
  expect(res.body.ok).toBe(false);
});

/* Error – not‑found (delete non‑existent)   */
itIfIntegration('delete project returns 404 for unknown id', async () => {
  const { app, token } = await setup();

  const res = await request(app)
    .delete('/projects/unknown-id')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toBe(404);
});

/* Auth – protected route rejects no token   */
itIfIntegration('POST /projects requires auth token', async () => {
  const { app } = await setup(); // we don't need a valid token

  const res = await request(app).post('/projects').send({ title: 'Should Fail' });

  expect(res.status).toBe(401);
  expect(res.body.ok).toBe(false);
  expect(res.body.error.code).toBe('UNAUTHENTICATED');
  expect(res.body.error.details).toBeNull();
  expect(typeof res.body.error.requestId).toBe('string');
});
