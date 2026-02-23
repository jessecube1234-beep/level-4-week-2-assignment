import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';

import { setupIntegrationApp, runIntegration } from './helpers/integration.js';
import { prisma } from '../src/db/prisma.js';

const describeIfIntegration = runIntegration ? describe : describe.skip;

describeIfIntegration('GET /health', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns ok', async () => {
    const { app } = setupIntegrationApp();
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.meta).toEqual({});
  });
});
