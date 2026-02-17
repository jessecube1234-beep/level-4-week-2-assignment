export const validateProjectId = (req, res, next) => {
  const projectId = req.params.id;
  if (!projectId) {
    return res.status(400).json({
      ok: false,
      error: { code: 'VALIDATION_ERROR', message: 'Missing project id' },
    });
  }
  next();
};
