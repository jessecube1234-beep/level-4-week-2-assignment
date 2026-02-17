export const validateTaskId = (req, res, next) => {
  const taskId = req.params.id;
  if (!taskId) {
    return res.status(400).json({
      ok: false,
      error: { code: 'VALIDATION_ERROR', message: 'Missing task id' },
    });
  }
  next();
};
