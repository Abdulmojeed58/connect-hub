import { userRepository } from '../repositories/user.repository.js';

export const userService = {
  async list(page: number, limit: number, search?: string) {
    const [users, total] = await userRepository.findManyPaginated(page, limit, search);
    return { users, total, page, limit };
  },
};
