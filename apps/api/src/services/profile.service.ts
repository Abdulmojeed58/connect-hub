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

  async updateExperience(userId: string, expId: string, data: Omit<Prisma.ExperienceUncheckedUpdateWithoutProfileInput, 'profileId'>) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    const exp = await profileRepository.findExperienceById(expId);
    if (!exp) throw new AppError(404, 'Experience not found');
    if (exp.profileId !== profile.id) throw new AppError(403, 'Forbidden');
    return profileRepository.updateExperience(expId, data);
  },

  async deleteExperience(userId: string, expId: string) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    const exp = await profileRepository.findExperienceById(expId);
    if (!exp) throw new AppError(404, 'Experience not found');
    if (exp.profileId !== profile.id) throw new AppError(403, 'Forbidden');
    return profileRepository.deleteExperience(expId);
  },

  async addEducation(userId: string, data: Omit<Prisma.EducationUncheckedCreateWithoutProfileInput, 'profileId'>) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    return profileRepository.addEducation(profile.id, data);
  },

  async updateEducation(userId: string, eduId: string, data: Omit<Prisma.EducationUncheckedUpdateWithoutProfileInput, 'profileId'>) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    const edu = await profileRepository.findEducationById(eduId);
    if (!edu) throw new AppError(404, 'Education not found');
    if (edu.profileId !== profile.id) throw new AppError(403, 'Forbidden');
    return profileRepository.updateEducation(eduId, data);
  },

  async deleteEducation(userId: string, eduId: string) {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new AppError(404, 'Profile not found');
    const edu = await profileRepository.findEducationById(eduId);
    if (!edu) throw new AppError(404, 'Education not found');
    if (edu.profileId !== profile.id) throw new AppError(403, 'Forbidden');
    return profileRepository.deleteEducation(eduId);
  },
};
