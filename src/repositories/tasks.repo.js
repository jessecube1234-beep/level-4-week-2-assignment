export const createTasksRepo = (prisma) => ({
  listByProjectId: (projectId) =>
    prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    }),

  create: (data) => prisma.task.create({ data }),

  findById: (id) =>
    prisma.task.findUnique({
      where: { id },
    }),

  updateById: (id, data) =>
    prisma.task.update({
      where: { id },
      data,
    }),

  deleteById: (id) =>
    prisma.task.delete({
      where: { id },
    }),
});
