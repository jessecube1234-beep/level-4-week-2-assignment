import { createUsersRepo } from '#repositories/users.repo';
import { createProjectsRepo } from '#repositories/projects.repo';
import { createTasksRepo } from '#repositories/tasks.repo';

export const createRepos = (prisma) => ({
  users: createUsersRepo(prisma),
  projects: createProjectsRepo(prisma),
  tasks: createTasksRepo(prisma),
});
