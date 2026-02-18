/**
 * This file handles basic project CRUD operations.
 * It lets me create, read, update, and delete projects
 * from the repos.projects array. Everything here works
 * directly with the in-memory projects list.
 */
export const createProject = (repos, project) => {
  repos.projects.push(project);
  return project;
};

export const getAllProjects = (repos, { limit = 20, offset = 0 }) => {
  return repos.projects.slice(offset, offset + limit);
};

export const findProjectById = (repos, id) => repos.projects.find((p) => p.id === id);

export const updateProject = (repos, id, data) => {
  const project = findProjectById(repos, id);
  if (!project) return null;
  Object.assign(project, data);
  return project;
};

export const deleteProject = (repos, id) => {
  const index = repos.projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  repos.projects.splice(index, 1);
  return true;
};
