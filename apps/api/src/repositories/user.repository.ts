import { prisma } from '../lib/prisma.js';

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data: { email: string; passwordHash: string }) {
    return prisma.user.create({ data });
  },

  findManyPaginated(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const q = search?.trim();
    const where = q
      ? { profile: { fullName: { contains: q, mode: 'insensitive' as const } } }
      : undefined;

    const profileSelect = {
      select: { id: true, fullName: true, headline: true, bio: true, location: true, photoUrl: true, isPremium: true },
    } as const;

    return Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        ...(where !== undefined && { where }),
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: profileSelect,
        },
        orderBy: { createdAt: 'desc' },
      }),
      where !== undefined ? prisma.user.count({ where }) : prisma.user.count(),
    ]);
  },
};
