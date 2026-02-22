/**
 * Validates that a project ID is in route params.
 * Returns 400 if theres no ID.
 */
export const validateProjectId = (req, res, next) => {
  const projectId = req.params.id;
  if (!projectId) {
    return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Missing project id' });
  }
  next();
};
