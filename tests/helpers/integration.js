import { createApp } from '#app';
import { createRepos } from '#repositories/index';
import { prisma } from '../../src/db/prisma.js';

export const runIntegration = process.env.RUN_INTEGRATION_TESTS === 'true';

export const setupIntegrationApp = () => {
  const repos = createRepos(prisma);
  const app = createApp({ repos, config: {} });
  return { app, repos };
};

export const resetDatabase = async () => {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
};
