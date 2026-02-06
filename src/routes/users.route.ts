import express from 'express';
import { getAuthenticatedUser, getUserById, searchUsers, updateAuthenticatedUser } from '../controllers/users.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { getRouterName } from 'hono/dev';

const router = express.Router();

// GET -> /users/me
router.get('/me', authenticate, getAuthenticatedUser);

// PUT -> /users/me
router.put('/me', authenticate, updateAuthenticatedUser);

// GET -> /users/search?={value}
router.get('/', authenticate, searchUsers);

// GET -> /users/{id}
router.get('/:id', authenticate, getUserById);


export const usersRouter = router;