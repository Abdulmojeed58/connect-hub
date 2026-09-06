import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password } = req.body as {
        fullName: string;
        email: string;
        password: string;
      };
      const tokens = await authService.register(fullName, email, password);
      res.status(201).json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const tokens = await authService.login(email, password);
      res.json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      await authService.logout(refreshToken);
      res.json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      const tokens = await authService.refresh(refreshToken);
      res.json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const data = await authService.getMe(userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
