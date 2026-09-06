import type { Prisma } from '@prisma/client';
import { profileRepository } from '../repositories/profile.repository.js';
import { AppError } from '../middleware/error.middleware.js';

export const profileService = {
  async getByUserId(userId: string) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    return profile;
  },

  async updateOwn(userId: string, data: Prisma.ProfileUpdateInput) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    return profileRepository.update(userId, data);
  },

  async addExperience(userId: string, data: Omit<Prisma.ExperienceUncheckedCreateWithoutProfileInput, 'profileId'>) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    return profileRepository.addExperience(profile.id, data);
  },

  async addEducation(userId: string, data: Omit<Prisma.EducationUncheckedCreateWithoutProfileInput, 'profileId'>) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    return profileRepository.addEducation(profile.id, data);
  },
};
