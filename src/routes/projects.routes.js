/**
 * This file defines the routes for project-related actions.
 * It handles listing, creating, retrieving, updating,
 * and deleting projects. Some routes are protected with
 * authentication and ID validation middleware.
 */
import express from 'express';
import {
  listProjects,
  createProjectCtrl,
  getProjectById,
  updateProjectCtrl,
  deleteProjectCtrl,
} from '#controllers/projects.controller';

import { requireAuth } from '#middleware/requireAuth';
import { validateProjectId } from '#middleware/validateProjectId';

const router = express.Router();

router.get('/', listProjects);
router.post('/', requireAuth, createProjectCtrl);

router
  .route('/:id')
  .get(validateProjectId, getProjectById)
  .put(requireAuth, validateProjectId, updateProjectCtrl)
  .delete(requireAuth, validateProjectId, deleteProjectCtrl);

// nested tasks route (will be mounted in app.js)
export { router as projectsRouter };
