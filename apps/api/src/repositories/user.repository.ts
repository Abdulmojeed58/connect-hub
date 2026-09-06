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

  findManyPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
  },
};
