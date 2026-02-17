export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = status === 500 ? 'Something went wrong' : err.message || 'Error';

  res.status(status).json({
    ok: false,
    error: {
      code,
      message,
      details: null,
      requestId: '',
    },
  });
};
