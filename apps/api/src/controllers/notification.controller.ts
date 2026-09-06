import type { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.listForUser(req.user!.sub);
      res.json({ success: true, data: { notifications } });
    } catch (err) {
      next(err);
    }
  },
};
