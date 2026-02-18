import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'test-secret';

export const signToken = ({ userId }) => {
  return jwt.sign({ sub: userId }, secret, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};