import 'dotenv/config';
import { test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';

import { hashPassword } from '#utils/password';
import { signToken } from '#utils/jwt';
import { prisma } from '../src/db/prisma.js';
import { runIntegration, setupIntegrationApp, resetDatabase } from './helpers/integration.js';

const itIfIntegration = runIntegration ? test : test.skip;

/**
 * Sets up an app instance with a user and one project.
 */
const setup = async () => {
  const { app, repos } = setupIntegrationApp();

  // Dummy user
  const password = await hashPassword('secret');
  const userId = '11111111-1111-4111-8111-111111111111';
  await repos.users.create({ id: userId, email: 'a@b.c', password });

  const token = signToken({ userId });

  // Create a project so we have an ID to attach tasks to
  const projRes = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Project X' });

  return { app, token, projectId: projRes.body.data.id };
};

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

/* Happy path – create a task               */
itIfIntegration('create task under project (happy path)', async () => {
  const { app, token, projectId } = await setup();

  const res = await request(app)
    .post(`/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({ description: 'Do something' });

  expect(res.status).toBe(201);
  expect(res.body.ok).toBe(true);
  expect(res.body.data.description).toBe('Do something');
});

/* Error – validation (missing description) */
itIfIntegration('create task fails without description', async () => {
  const { app, token, projectId } = await setup();

  const res = await request(app)
    .post(`/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({}); // missing description

  expect(res.status).toBe(400);
});

/* Error – not‑found (unknown project)      */
itIfIntegration('create task on unknown project returns 404', async () => {
  const { app, token } = await setup();

  const res = await request(app)
    .post('/projects/does-not-exist/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ description: 'Should fail' });

  expect(res.status).toBe(404);
});

/* Auth – protected route rejects no token   */
itIfIntegration('POST /projects/:id/tasks requires auth token', async () => {
  const { app, projectId } = await setup(); // no token

  const res = await request(app)
    .post(`/projects/${projectId}/tasks`)
    .send({ description: 'Auth test' });

  expect(res.status).toBe(401);
  expect(res.body.ok).toBe(false);
  expect(res.body.error.code).toBe('UNAUTHENTICATED');
  expect(res.body.error.details).toBeNull();
  expect(typeof res.body.error.requestId).toBe('string');
});
