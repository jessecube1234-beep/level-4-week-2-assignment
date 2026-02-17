export const respond = (req, res, next) => {
  res.ok = (data = {}, meta = {}) => res.json({ ok: true, data, meta });

  res.created = (data = {}, meta = {}) => res.status(201).json({ ok: true, data, meta });

  next();
};
