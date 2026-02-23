const parseInclude = (includeValue) => {
  if (!includeValue) return undefined;
  const tokens = includeValue
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  const include = {};
  if (tokens.includes('tasks')) include.tasks = true;
  if (tokens.includes('author')) include.author = { select: { id: true, email: true } };
  return Object.keys(include).length ? include : undefined;
};

export const createProjectsRepo = (prisma) => ({
  list: async ({ limit = 20, offset = 0, authorId, includeCounts = false }) => {
    const where = authorId ? { authorId } : undefined;
    const include = includeCounts ? { _count: { select: { tasks: true } } } : undefined;
    return prisma.project.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
  },

  create: (data) => prisma.project.create({ data }),

  findById: (id, includeValue) =>
    prisma.project.findUnique({
      where: { id },
      include: parseInclude(includeValue),
    }),

  updateById: (id, data) =>
    prisma.project.update({
      where: { id },
      data,
    }),

  deleteById: (id) =>
    prisma.project.delete({
      where: { id },
    }),
});
