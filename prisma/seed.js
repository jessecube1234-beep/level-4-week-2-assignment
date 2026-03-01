import { randomUUID } from 'crypto';
import { hashPassword } from '../src/utils/password.js';
import { prisma } from '../src/db/prisma.js';

async function main() {
  const userId = randomUUID();
  const projectId = randomUUID();
  const secondProjectId = randomUUID();

  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      id: userId,
      email: 'seed.user@example.com',
      password: await hashPassword('secret123'),
    },
  });

  await prisma.project.createMany({
    data: [
      { id: projectId, title: 'Seed Project A', authorId: user.id },
      { id: secondProjectId, title: 'Seed Project B', authorId: user.id },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        id: randomUUID(),
        projectId,
        description: 'Seed Task 1',
        authorId: user.id,
      },
      {
        id: randomUUID(),
        projectId: secondProjectId,
        description: 'Seed Task 2',
        authorId: user.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
