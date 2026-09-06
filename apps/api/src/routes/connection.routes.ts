import { Router, type IRouter } from 'express';
import { connectionController } from '../controllers/connection.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router: IRouter = Router();

router.get('/', requireAuth, connectionController.listAccepted);
router.get('/pending', requireAuth, connectionController.listPending);
router.get('/sent', requireAuth, connectionController.listSent);
router.post('/request/:userId', requireAuth, connectionController.sendRequest);
router.post('/:id/accept', requireAuth, connectionController.accept);
router.post('/:id/decline', requireAuth, connectionController.decline);
router.delete('/:id', requireAuth, connectionController.remove);

export { router as connectionRouter };
