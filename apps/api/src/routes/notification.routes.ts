import { Router, type IRouter } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router: IRouter = Router();

router.get('/', requireAuth, notificationController.list);

export { router as notificationRouter };
