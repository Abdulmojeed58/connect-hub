import { notificationRepository } from '../repositories/notification.repository.js';

export const notificationService = {
  async listForUser(userId: string) {
    return notificationRepository.findByUserId(userId);
  },
};
