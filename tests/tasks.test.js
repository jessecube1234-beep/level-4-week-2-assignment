import 'dotenv/config';
import { test, expect } from 'vitest';
import request from 'supertest';

import { createApp } from '#app';
import { createRepos } from '#repositories/index';
import { hashPassword } from '#utils/password';
import { signToken } from '#utils/jwt';

/**
 * Sets up an app instance with a user and one project.
 */
const setup = async () => {
  const repos = await createRepos();
  const app = createApp({ repos, config: {} });

  // Dummy user
  const password = await hashPassword('secret');
  const userId = 'user-1';
  repos.users = [{ id: userId, email: 'a@b.c', password }];

  const token = signToken({ userId });

  // Create a project so we have an ID to attach tasks to
  const projRes = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Project X' });

  return { app, token, projectId: projRes.body.data.id };
};

/* Happy path – create a task               */
test('create task under project (happy path)', async () => {
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
test('create task fails without description', async () => {
  const { app, token, projectId } = await setup();

  const res = await request(app)
    .post(`/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({}); // missing description

  expect(res.status).toBe(400);
});

/* Error – not‑found (unknown project)      */
test('create task on unknown project returns 404', async () => {
  const { app, token } = await setup();

  const res = await request(app)
    .post('/projects/does-not-exist/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ description: 'Should fail' });

  expect(res.status).toBe(404);
});

/* Auth – protected route rejects no token   */
test('POST /projects/:id/tasks requires auth token', async () => {
  const { app, projectId } = await setup(); // no token

  const res = await request(app)
    .post(`/projects/${projectId}/tasks`)
    .send({ description: 'Auth test' });

  expect(res.status).toBe(401);
});
