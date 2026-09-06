import { Router, type IRouter } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router: IRouter = Router();

router.get('/', requireAuth, userController.list);

export { router as userRouter };
