/**
 * Handles unknown routes.
 * Returns a 404 response when no matching route is found.
 */
export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    ok: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
};
