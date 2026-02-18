import { v4 as uuidv4 } from 'uuid';

import {
  createProject,
  getAllProjects,
  findProjectById,
  updateProject,
  deleteProject,
} from '#repositories/projects.repo';
import { validateProjectInput } from '#utils/validateProjectInput';

/**
 * Controller to list all projects with pagination support.
 *
 * @param {Object} req - Request object containing query parameters (limit, offset).
 * @param {Object} res - Response object to send back data or errors.
 */
export const listProjects = (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = parseInt(req.query.offset, 10) || 0;

  const projects = getAllProjects(res.locals.repos, { limit, offset });
  res.ok(projects);
};

/* Create a new project */
export const createProjectCtrl = (req, res) => {
  validateProjectInput(req.body);

  const project = {
    id: uuidv4(),
    title: req.body.title,
    authorId: req.user.id,
  };

  createProject(res.locals.repos, project);
  res.created(project);
};

/* Get a single project by ID */
export const getProjectById = (req, res) => {
  const project = findProjectById(res.locals.repos, req.params.id);

  if (!project)
    throw { status: 404, code: 'NOT_FOUND', message: 'Project not found' };
  res.ok(project);
};

/* Update an existing project */
export const updateProjectCtrl = (req, res) => {
  validateProjectInput(req.body);

  const project = findProjectById(res.locals.repos, req.params.id);
  if (!project)
    throw { status: 404, code: 'NOT_FOUND', message: 'Project not found' };

  if (project.authorId !== req.user.id)
    throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  const updated = updateProject(res.locals.repos, req.params.id, { title: req.body.title });
  res.ok(updated);
};

/* Delete a project */
export const deleteProjectCtrl = (req, res) => {
  const project = findProjectById(res.locals.repos, req.params.id);
  if (!project)
    throw { status: 404, code: 'NOT_FOUND', message: 'Project not found' };

  if (project.authorId !== req.user.id)
    throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  deleteProject(res.locals.repos, req.params.id);
  res.ok();
};
