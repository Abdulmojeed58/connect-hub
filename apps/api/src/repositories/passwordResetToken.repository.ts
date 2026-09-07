import { prisma } from '../lib/prisma.js';

export const passwordResetTokenRepository = {
  create(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.passwordResetToken.create({ data });
  },

  findByToken(token: string) {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  },

  deleteByToken(token: string) {
    return prisma.passwordResetToken.delete({ where: { token } });
  },

  deleteAllForUser(userId: string) {
    return prisma.passwordResetToken.deleteMany({ where: { userId } });
  },
};
