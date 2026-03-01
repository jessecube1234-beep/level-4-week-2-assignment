import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (plain) => {
  return await bcrypt.hash(plain, SALT_ROUNDS);
};

export const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
