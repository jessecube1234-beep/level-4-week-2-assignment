import express from 'express';
import {
  listTasks,
  createTaskCtrl,
  updateTaskCtrl,
  deleteTaskCtrl,
} from '#controllers/tasks.controller';

import { requireAuth } from '#middleware/requireAuth';
import { validateTaskId } from '#middleware/validateTaskId';

const router = express.Router({ mergeParams: true });

router.get('/', listTasks);
router.post('/', requireAuth, createTaskCtrl);

router
  .route('/:id')
  .put(requireAuth, validateTaskId, updateTaskCtrl)
  .delete(requireAuth, validateTaskId, deleteTaskCtrl);

export { router as tasksRouter };
