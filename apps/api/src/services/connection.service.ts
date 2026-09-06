import { connectionRepository } from '../repositories/connection.repository.js';
import { notificationRepository } from '../repositories/notification.repository.js';
import { AppError } from '../middleware/error.middleware.js';
import { emailService } from './email.service.js';

export const connectionService = {
  async sendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new AppError(400, 'Cannot connect with yourself');
    }

    const existing = await connectionRepository.findBetween(requesterId, addresseeId);
    if (existing) {
      if (existing.status === 'pending' || existing.status === 'accepted') {
        throw new AppError(409, 'A connection or pending request already exists');
      }
      // Previous request was declined — remove it so a fresh one can be created
      await connectionRepository.delete(existing.id);
    }

    const connection = await connectionRepository.create(requesterId, addresseeId);

    await notificationRepository.create({
      userId: addresseeId,
      type: 'CONNECTION_REQUEST',
      message: 'You have a new connection request',
    });

    emailService.sendConnectionRequest(
      connection.addressee.email,
      connection.requester.profile?.fullName ?? 'Someone',
    );

    return connection;
  },

  async accept(connectionId: string, userId: string) {
    const connection = await connectionRepository.findById(connectionId);
    if (!connection) throw new AppError(404, 'Connection not found');
    if (connection.addresseeId !== userId) throw new AppError(403, 'Forbidden');
    if (connection.status !== 'pending') throw new AppError(400, 'Request is not pending');

    const updated = await connectionRepository.updateStatus(connectionId, 'accepted');

    await notificationRepository.create({
      userId: connection.requesterId,
      type: 'CONNECTION_ACCEPTED',
      message: 'Your connection request was accepted',
    });

    emailService.sendConnectionAccepted(
      connection.requester.email,
      connection.addressee.profile?.fullName ?? 'Someone',
    );

    return updated;
  },

  async decline(connectionId: string, userId: string) {
    const connection = await connectionRepository.findById(connectionId);
    if (!connection) throw new AppError(404, 'Connection not found');
    if (connection.addresseeId !== userId) throw new AppError(403, 'Forbidden');
    if (connection.status !== 'pending') throw new AppError(400, 'Request is not pending');

    const updated = await connectionRepository.updateStatus(connectionId, 'declined');

    await notificationRepository.create({
      userId: connection.requesterId,
      type: 'CONNECTION_DECLINED',
      message: 'Your connection request was declined',
    });

    emailService.sendConnectionDeclined(
      connection.requester.email,
      connection.addressee.profile?.fullName ?? 'Someone',
    );

    return updated;
  },

  async remove(connectionId: string, userId: string) {
    const connection = await connectionRepository.findById(connectionId);
    if (!connection) throw new AppError(404, 'Connection not found');

    const isParty =
      connection.requesterId === userId || connection.addresseeId === userId;
    if (!isParty) throw new AppError(403, 'Forbidden');

    return connectionRepository.delete(connectionId);
  },

  async listAccepted(userId: string) {
    return connectionRepository.findAccepted(userId);
  },

  async listPending(userId: string) {
    return connectionRepository.findPendingReceived(userId);
  },

  async listSent(userId: string) {
    return connectionRepository.findPendingSent(userId);
  },
};
