import { Router, type IRouter } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router: IRouter = Router();

const registerSchema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshLogoutSchema = z.object({
  refreshToken: z.string().min(1),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshLogoutSchema), authController.refresh);
router.post('/logout', requireAuth, validate(refreshLogoutSchema), authController.logout);
router.get('/me', requireAuth, authController.me);

export { router as authRouter };
