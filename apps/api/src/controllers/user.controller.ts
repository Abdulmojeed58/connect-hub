import type { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';

export const userController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
      const limit = Math.min(50, Math.max(1, parseInt(String(req.query['limit'] ?? '20'), 10)));
      const search = req.query['search'] ? String(req.query['search']) : undefined;
      const data = await userService.list(page, limit, search);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
