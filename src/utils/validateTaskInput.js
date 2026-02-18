export const validateTaskInput = (data) => {
  if (!data.description || typeof data.description !== 'string') {
    throw { status: 400, code: 'VALIDATION_ERROR', message: 'description is required' };
  }
};
