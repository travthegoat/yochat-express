import express from 'express';
import { login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// POST -> /register (create new user)
router.post('/register', register);

// POST -> /login (user login)
router.post('/login', login);

// POST -> /logout (user logout)
router.post('/logout', authenticate, logout);

// POST -> /token/refresh (refresh access token)
router.post('/token/refresh', refreshToken);

export const authRouter = router;