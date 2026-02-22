/**
 * Handles unknown routes.
 * Returns a 404 response when no matching route is found.
 */
export const notFoundHandler = (_req, _res, next) => {
  next({ status: 404, code: 'NOT_FOUND', message: 'Route not found' });
};
