import dotenv from 'dotenv';
dotenv.config();

export const ensureEnv = () => {
  const required = ['PORT', 'JWT_SECRET', 'DATABASE_URL'];
  const missing = required.filter((k) => !process.env[k]);

  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  return {
    PORT: parseInt(process.env.PORT, 10),
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  };
};
