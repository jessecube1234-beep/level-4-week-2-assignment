export const createTask = (repos, task) => {
  repos.tasks.push(task);
  return task;
};

export const getTasksByProjectId = (repos, projectId) =>
  repos.tasks.filter((t) => t.projectId === projectId);

export const findTaskById = (repos, id) => repos.tasks.find((t) => t.id === id);

export const updateTask = (repos, id, data) => {
  const task = findTaskById(repos, id);
  if (!task) return null;
  Object.assign(task, data);
  return task;
};

export const deleteTask = (repos, id) => {
  const index = repos.tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  repos.tasks.splice(index, 1);
  return true;
};
