import { randomUUID } from 'crypto';
import { validateProjectInput } from '#utils/validateProjectInput';

/**
 * Controller to list all projects with pagination support.
 *
 * @param {Object} req - Request object containing query parameters (limit, offset).
 * @param {Object} res - Response object to send back data or errors.
 */
export const listProjects = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = parseInt(req.query.offset, 10) || 0;
  const includeCounts = req.query.includeCounts === 'true';
  const authorId = req.query.authorId;

  const projects = await res.locals.repos.projects.list({
    limit,
    offset,
    includeCounts,
    authorId,
  });
  res.ok(projects);
};

/* Create a new project */
export const createProjectCtrl = async (req, res) => {
  validateProjectInput(req.body);

  const project = {
    id: randomUUID(),
    title: req.body.title,
    authorId: req.user.id,
  };

  await res.locals.repos.projects.create(project);
  res.created(project);
};

/* Get a single project by ID */
export const getProjectById = async (req, res) => {
  const project = await res.locals.repos.projects.findById(req.params.id, req.query.include);

  if (!project) throw { status: 404, code: 'NOT_FOUND', message: 'Project not found' };
  res.ok(project);
};

/* Update an existing project */
export const updateProjectCtrl = async (req, res) => {
  validateProjectInput(req.body);

  const project = await res.locals.repos.projects.findById(req.params.id);
  if (!project) throw { status: 404, code: 'NOT_FOUND', message: 'Project not found' };

  if (project.authorId !== req.user.id)
    throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  const updated = await res.locals.repos.projects.updateById(req.params.id, { title: req.body.title });
  res.ok(updated);
};

/* Delete a project */
export const deleteProjectCtrl = async (req, res) => {
  const project = await res.locals.repos.projects.findById(req.params.id);
  if (!project) throw { status: 404, code: 'NOT_FOUND', message: 'Project not found' };

  if (project.authorId !== req.user.id)
    throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  await res.locals.repos.projects.deleteById(req.params.id);
  res.ok();
};
