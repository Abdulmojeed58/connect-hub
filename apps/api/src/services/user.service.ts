import { userRepository } from '../repositories/user.repository.js';

export const userService = {
  async list(page: number, limit: number) {
    const [users, total] = await userRepository.findManyPaginated(page, limit);
    return { users, total, page, limit };
  },
};
