/**
 * This file sets up the authentication routes.
 * It defines the register and login endpoints
 * and connects them to their controller functions.
 */
import express from 'express';
import { registerCtrl, loginCtrl } from '#controllers/auth.controller';

const router = express.Router();

router.post('/register', registerCtrl);
router.post('/login', loginCtrl);

export { router as authRouter };