import 'dotenv/config';
import { test, expect } from 'vitest';
import request from 'supertest';

import { createApp } from '#app';
import { createRepos } from '#repositories/index';
import { hashPassword } from '#utils/password';

/**
 * Helper that creates a fresh app instance with empty repos.
 */
const setup = async () => {
  const repos = await createRepos();
  const app = createApp({ repos, config: {} });
  return { app, repos };
};

/* Happy path  for register & login */
test('register & login (happy path)', async () => {
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
test('register fails without email/password', async () => {
  const { app } = await setup();

  const res = await request(app)
    .post('/auth/register')
    .send({}); // missing email & password

  expect(res.status).toBe(400);
  expect(res.body.ok).toBe(false);
});

/* Error – duplicate email */
test('register fails if email already exists', async () => {
  const { app, repos } = await setup();

  // existing user
  const password = await hashPassword('secret');
  repos.users = [{ id: 'user-1', email: 'a@b.c', password }];

  const res = await request(app)
    .post('/auth/register')
    .send({ email: 'a@b.c', password: 'secret' });

  expect(res.status).toBe(409);
  expect(res.body.ok).toBe(false);
});

/* Error – invalid credentials */
test('login fails with wrong password', async () => {
  const { app, repos } = await setup();

  const password = await hashPassword('secret');
  repos.users = [{ id: 'user-1', email: 'a@b.c', password }];

  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'a@b.c', password: 'wrong-password' });

  expect(res.status).toBe(401);
  expect(res.body.ok).toBe(false);
});
