import { Router, type IRouter } from 'express';
import { z } from 'zod';
import { profileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router: IRouter = Router();

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  headline: z.string().max(220).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  photoUrl: z.string().url().optional(),
});

const addExperienceSchema = z.object({
  company: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  description: z.string().max(2000).optional(),
});

const addEducationSchema = z.object({
  school: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  field: z.string().min(1).max(200),
  year: z.number().int().min(1900).max(2100),
});

router.get('/:userId', requireAuth, profileController.getByUserId);
router.put('/me', requireAuth, validate(updateProfileSchema), profileController.updateOwn);
router.post('/me/experience', requireAuth, validate(addExperienceSchema), profileController.addExperience);
router.put('/me/experience/:id', requireAuth, validate(addExperienceSchema), profileController.updateExperience);
router.delete('/me/experience/:id', requireAuth, profileController.deleteExperience);
router.post('/me/education', requireAuth, validate(addEducationSchema), profileController.addEducation);
router.put('/me/education/:id', requireAuth, validate(addEducationSchema), profileController.updateEducation);
router.delete('/me/education/:id', requireAuth, profileController.deleteEducation);

export { router as profileRouter };
