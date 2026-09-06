import type { NotificationType } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export const notificationRepository = {
  findByUserId(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  create(data: { userId: string; type: NotificationType; message: string }) {
    return prisma.notification.create({ data });
  },

  markRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  },
};
