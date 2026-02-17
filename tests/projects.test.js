import 'dotenv/config';
import { test, expect } from 'vitest';
import request from 'supertest';

import { createApp } from '#app'; // <-- path alias to your app factory
import { createRepos } from '#repositories/index'; // <-- path alias to repo factory
import { hashPassword } from '#utils/password';
import { signToken } from '#utils/jwt';

/**
 * Helper that creates an app instance and a signed token for a single user.
 */
const setup = async () => {
  const repos = await createRepos();
  const app = createApp({ repos, config: {} });

  // Create a dummy user
  const password = await hashPassword('secret');
  const userId = 'user-1';
  repos.users = [{ id: userId, email: 'a@b.c', password }];

  const token = signToken({ userId });
  return { app, token };
};

/* Happy path – create & list projects      */
test('create & list projects (happy path)', async () => {
  const { app, token } = await setup();

  // ---- Create a project
  const res1 = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'My Project' });

  expect(res1.status).toBe(201);
  expect(res1.body.ok).toBe(true);
  expect(res1.body.data.title).toBe('My Project');

  // ---- List projects
  const res2 = await request(app).get('/projects');
  expect(res2.status).toBe(200);
  expect(Array.isArray(res2.body.data)).toBe(true);
  expect(res2.body.data.length).toBe(1);
});


/* Error – validation (missing title)       */
test('create project fails without title', async () => {
  const { app, token } = await setup();

  const res = await request(app).post('/projects').set('Authorization', `Bearer ${token}`).send({}); // no title

  expect(res.status).toBe(400);
  expect(res.body.ok).toBe(false);
});

/* Error – not‑found (delete non‑existent)   */
test('delete project returns 404 for unknown id', async () => {
  const { app, token } = await setup();

  const res = await request(app)
    .delete('/projects/unknown-id')
    .set('Authorization', `Bearer ${token}`);

  expect(res.status).toBe(404);
});

/* Auth – protected route rejects no token   */
test('POST /projects requires auth token', async () => {
  const { app } = await setup(); // we don't need a valid token

  const res = await request(app).post('/projects').send({ title: 'Should Fail' });

  expect(res.status).toBe(401);
});
