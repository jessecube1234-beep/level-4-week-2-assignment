import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from '#middleware/errorHandler';
import { notFoundHandler } from '#middleware/notFoundHandler';
import { respond } from '#middleware/respond';

import { projectsRouter } from '#routes/projects.routes';
import { tasksRouter } from '#routes/tasks.routes';

export const createApp = ({ repos, config }) => {
  const app = express();
  app.locals.config = config;

  app.use(express.json());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(respond);

  // health
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // inject repos
  app.use((_req, res, next) => {
    res.locals.repos = repos;
    next();
  });

  // routes
  app.use('/projects', projectsRouter);
  app.use('/tasks', tasksRouter); // flat route for convenience

  // nested route: /projects/:id/tasks
  app.use('/projects/:projectId/tasks', tasksRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
