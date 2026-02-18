/**
 * Adds helper methods (res.ok, res.created) to ensure
 * all successful responses follow the APIs format.
 */
export const respond = (_req, res, next) => {
  res.ok = (data = {}, meta = {}) => res.json({ ok: true, data, meta });

  res.created = (data = {}, meta = {}) => res.status(201).json({ ok: true, data, meta });

  next();
};
