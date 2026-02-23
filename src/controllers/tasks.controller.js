import { randomUUID } from 'crypto';
import { validateTaskInput } from '#utils/validateTaskInput';

/* List all tasks for a project */
export const listTasks = async (req, res) => {
  const tasks = await res.locals.repos.tasks.listByProjectId(req.params.projectId);
  res.ok(tasks);
};

/* Create a new task */
export const createTaskCtrl = async (req, res) => {
  // Validate incoming data
  validateTaskInput(req.body);

  /* Ensure the project exists before creating a task */
  const { projectId } = req.params;
  const repoProject = await res.locals.repos.projects.findById(projectId);
  if (!repoProject) {
    // Unknown project – respond with 404
    throw { status: 404, code: 'NOT_FOUND', message: 'Project not found' };
  }

  const task = {
    id: randomUUID(),
    projectId,
    description: req.body.description,
    authorId: req.user.id,
  };

  await res.locals.repos.tasks.create(task);
  res.created(task);
};

/* Update an existing task */
export const updateTaskCtrl = async (req, res) => {
  validateTaskInput(req.body);

  const task = await res.locals.repos.tasks.findById(req.params.id);
  if (!task) throw { status: 404, code: 'NOT_FOUND', message: 'Task not found' };

  if (task.authorId !== req.user.id) throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  const updated = await res.locals.repos.tasks.updateById(req.params.id, {
    description: req.body.description,
  });
  res.ok(updated);
};

/* Delete a task */
export const deleteTaskCtrl = async (req, res) => {
  const task = await res.locals.repos.tasks.findById(req.params.id);
  if (!task) throw { status: 404, code: 'NOT_FOUND', message: 'Task not found' };

  if (task.authorId !== req.user.id) throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  await res.locals.repos.tasks.deleteById(req.params.id);
  res.ok();
};
