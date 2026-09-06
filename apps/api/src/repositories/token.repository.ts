import { prisma } from '../lib/prisma.js';

export const tokenRepository = {
  create(data: { id: string; token: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  },

  findByToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  deleteByToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } });
  },

  deleteAllForUser(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  },
};
