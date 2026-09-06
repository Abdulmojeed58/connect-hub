import type { ConnectionStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

const publicUserSelect = {
  id: true,
  email: true,
  createdAt: true,
  profile: {
    select: {
      id: true,
      fullName: true,
      headline: true,
      bio: true,
      location: true,
      photoUrl: true,
      isPremium: true,
    },
  },
} as const;

const connectionInclude = {
  requester: { select: publicUserSelect },
  addressee: { select: publicUserSelect },
} as const;

export const connectionRepository = {
  findById(id: string) {
    return prisma.connection.findUnique({ where: { id }, include: connectionInclude });
  },

  findBetween(requesterId: string, addresseeId: string) {
    return prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });
  },

  create(requesterId: string, addresseeId: string) {
    return prisma.connection.create({
      data: { requesterId, addresseeId, status: 'pending' },
      include: connectionInclude,
    });
  },

  updateStatus(id: string, status: ConnectionStatus) {
    return prisma.connection.update({
      where: { id },
      data: { status },
      include: connectionInclude,
    });
  },

  delete(id: string) {
    return prisma.connection.delete({ where: { id } });
  },

  findAccepted(userId: string, search?: string) {
    const q = search?.trim();
    return prisma.connection.findMany({
      where: {
        status: 'accepted',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
        ...(q && {
          AND: {
            OR: [
              { requester: { profile: { fullName: { contains: q, mode: 'insensitive' } } } },
              { addressee: { profile: { fullName: { contains: q, mode: 'insensitive' } } } },
            ],
          },
        }),
      },
      include: connectionInclude,
    });
  },

  findPendingReceived(userId: string, search?: string) {
    const q = search?.trim();
    return prisma.connection.findMany({
      where: {
        addresseeId: userId,
        status: 'pending',
        ...(q && {
          requester: { profile: { fullName: { contains: q, mode: 'insensitive' } } },
        }),
      },
      include: connectionInclude,
    });
  },

  findPendingSent(userId: string) {
    return prisma.connection.findMany({
      where: { requesterId: userId, status: 'pending' },
      include: connectionInclude,
    });
  },
};
