export const validateProjectInput = (data) => {
  if (!data.title || typeof data.title !== 'string') {
    throw { status: 400, code: 'VALIDATION_ERROR', message: 'title is required' };
  }
};
