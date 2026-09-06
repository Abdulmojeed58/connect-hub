import type { Request, Response, NextFunction } from 'express';
import { connectionService } from '../services/connection.service.js';

export const connectionController = {
  async sendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await connectionService.sendRequest(
        req.user!.sub,
        String(req.params['userId']),
      );
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await connectionService.accept(String(req.params['id']), req.user!.sub);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async decline(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await connectionService.decline(String(req.params['id']), req.user!.sub);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await connectionService.remove(String(req.params['id']), req.user!.sub);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async listAccepted(req: Request, res: Response, next: NextFunction) {
    try {
      const connections = await connectionService.listAccepted(req.user!.sub);
      res.json({ success: true, data: { connections } });
    } catch (err) {
      next(err);
    }
  },

  async listPending(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await connectionService.listPending(req.user!.sub);
      res.json({ success: true, data: { requests } });
    } catch (err) {
      next(err);
    }
  },

  async listSent(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await connectionService.listSent(req.user!.sub);
      res.json({ success: true, data: { requests } });
    } catch (err) {
      next(err);
    }
  },
};
