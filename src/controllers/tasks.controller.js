import { randomUUID } from 'crypto';
import {
  createTask,
  getTasksByProjectId,
  findTaskById,
  updateTask,
  deleteTask,
} from '#repositories/tasks.repo';
import { validateTaskInput } from '#utils/validateTaskInput';

/* List all tasks for a project */
export const listTasks = (req, res) => {
  const tasks = getTasksByProjectId(res.locals.repos, req.params.projectId);
  res.ok(tasks);
};

/* Create a new task */
export const createTaskCtrl = (req, res) => {
  // Validate incoming data
  validateTaskInput(req.body);

  /* Ensure the project exists before creating a task */
  const { projectId } = req.params;
  const repoProject = res.locals.repos.projects.find((p) => p.id === projectId);
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

  createTask(res.locals.repos, task);
  res.created(task);
};

/* Update an existing task */
export const updateTaskCtrl = (req, res) => {
  validateTaskInput(req.body);

  const task = findTaskById(res.locals.repos, req.params.id);
  if (!task) throw { status: 404, code: 'NOT_FOUND', message: 'Task not found' };

  if (task.authorId !== req.user.id) throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  const updated = updateTask(res.locals.repos, req.params.id, {
    description: req.body.description,
  });
  res.ok(updated);
};

/* Delete a task */
export const deleteTaskCtrl = (req, res) => {
  const task = findTaskById(res.locals.repos, req.params.id);
  if (!task) throw { status: 404, code: 'NOT_FOUND', message: 'Task not found' };

  if (task.authorId !== req.user.id) throw { status: 403, code: 'FORBIDDEN', message: 'Not owner' };

  deleteTask(res.locals.repos, req.params.id);
  res.ok();
};
