import type { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service.js';

export const profileController = {
  async getByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getByUserId(String(req.params['userId']));
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  async updateOwn(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.updateOwn(req.user!.sub, req.body);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  async addExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await profileService.addExperience(req.user!.sub, req.body);
      res.status(201).json({ success: true, data: experience });
    } catch (err) {
      next(err);
    }
  },

  async addEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const education = await profileService.addEducation(req.user!.sub, req.body);
      res.status(201).json({ success: true, data: education });
    } catch (err) {
      next(err);
    }
  },
};
