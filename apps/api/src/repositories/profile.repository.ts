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

  addEducation(profileId: string, data: Prisma.EducationUncheckedCreateWithoutProfileInput) {
    return prisma.education.create({ data: { ...data, profileId } });
  },
};
