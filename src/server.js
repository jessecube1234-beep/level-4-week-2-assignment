import { ensureEnv } from '#utils/env';
import { createApp } from '#app';
import { createRepos } from '#repositories/index';
import { prisma } from './db/prisma.js';

const env = ensureEnv();
const repos = createRepos(prisma);

const app = createApp({
  repos,
  config: { JWT_SECRET: env.JWT_SECRET },
});

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
