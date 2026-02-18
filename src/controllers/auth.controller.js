import { v4 as uuidv4 } from 'uuid';
import { createUser, findUserByEmail } from '#repositories/users.repo';
import { hashPassword, comparePasswords } from '#utils/password';
import { signToken } from '#utils/jwt';

/* Create a new user account */
export const registerCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw { status: 400, code: 'VALIDATION_ERROR', message: 'email and password required' };
    }


    const existing = findUserByEmail(res.locals.repos, email);
    if (existing) {
      throw { status: 409, code: 'EMAIL_EXISTS', message: 'Email already registered' };
    }

    const hashed = await hashPassword(password);

    const user = {
      id: uuidv4(),
      email,
      password: hashed,
    };

    createUser(res.locals.repos, user);

    const token = signToken({ userId: user.id });

    res.created({ token });
  } catch (err) {
    next(err);
  }
};

/* Login user */
export const loginCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw { status: 400, code: 'VALIDATION_ERROR', message: 'email and password required' };
    }

    const user = findUserByEmail(res.locals.repos, email);
    if (!user) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const valid = await comparePasswords(password, user.password);
    if (!valid) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const token = signToken({ userId: user.id });

    res.ok({ token });
  } catch (err) {
    next(err);
  }
};