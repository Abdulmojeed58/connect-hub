import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export const profileRepository = {
  findByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        fullName: true,
        headline: true,
        bio: true,
        location: true,
        photoUrl: true,
        isPremium: true,
        user: { select: { id: true, email: true, createdAt: true } },
        experiences: true,
        educations: true,
      },
    });
  },

  create(data: { userId: string; fullName: string }) {
    return prisma.profile.create({ data });
  },

  update(userId: string, data: Prisma.ProfileUpdateInput) {
    return prisma.profile.update({
      where: { userId },
      data,
      select: {
        id: true,
        fullName: true,
        headline: true,
        bio: true,
        location: true,
        photoUrl: true,
        isPremium: true,
        user: { select: { id: true, email: true, createdAt: true } },
        experiences: true,
        educations: true,
      },
    });
  },

  addExperience(profileId: string, data: Prisma.ExperienceUncheckedCreateWithoutProfileInput) {
    return prisma.experience.create({ data: { ...data, profileId } });
  },

  findExperienceById(id: string) {
    return prisma.experience.findUnique({ where: { id } });
  },

  updateExperience(id: string, data: Prisma.ExperienceUncheckedUpdateWithoutProfileInput) {
    return prisma.experience.update({ where: { id }, data });
  },

  deleteExperience(id: string) {
    return prisma.experience.delete({ where: { id } });
  },

  addEducation(profileId: string, data: Prisma.EducationUncheckedCreateWithoutProfileInput) {
    return prisma.education.create({ data: { ...data, profileId } });
  },

  findEducationById(id: string) {
    return prisma.education.findUnique({ where: { id } });
  },

  updateEducation(id: string, data: Prisma.EducationUncheckedUpdateWithoutProfileInput) {
    return prisma.education.update({ where: { id }, data });
  },

  deleteEducation(id: string) {
    return prisma.education.delete({ where: { id } });
  },
};
