import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'crypto';
import { env } from '../config/env.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { profileRepository } from '../repositories/profile.repository.js';
import { tokenRepository } from '../repositories/token.repository.js';
import { passwordResetTokenRepository } from '../repositories/passwordResetToken.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../middleware/error.middleware.js';
import { emailService } from './email.service.js';

export const authService = {
  async register(fullName: string, email: string, password: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError(409, 'Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ email, passwordHash });
    await profileRepository.create({ userId: user.id, fullName });

    emailService.sendWelcome(email, fullName);

    return issueTokens(user.id, user.email);
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const profile = await profileRepository.findByUserId(user.id);
    emailService.sendLoginAlert(email, profile?.fullName ?? 'there');

    return issueTokens(user.id, user.email);
  },

  async logout(refreshToken: string) {
    await tokenRepository.deleteByToken(refreshToken).catch(() => null);
  },

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const stored = await tokenRepository.findByToken(refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError(401, 'Invalid or expired refresh token');
    }

    await tokenRepository.deleteByToken(refreshToken);
    const user = await userRepository.findById(payload.sub);
    if (!user) throw new AppError(401, 'User not found');
    return issueTokens(user.id, user.email);
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'User not found');

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new AppError(400, 'Current password is incorrect');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userRepository.updatePassword(userId, passwordHash);

    // Revoke all refresh tokens so other sessions are forced to re-login
    await tokenRepository.deleteAllForUser(userId);

    const profile = await profileRepository.findByUserId(userId);
    emailService.sendPasswordChanged(user.email, profile?.fullName ?? 'there');
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    // Always return success — never reveal whether an email is registered
    if (!user) return;

    // Invalidate any existing reset tokens for this user
    await passwordResetTokenRepository.deleteAllForUser(user.id);

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await passwordResetTokenRepository.create({ token, userId: user.id, expiresAt });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const profile = await profileRepository.findByUserId(user.id);
    emailService.sendPasswordResetLink(email, profile?.fullName ?? 'there', resetUrl);
  },

  async resetPassword(token: string, newPassword: string) {
    const record = await passwordResetTokenRepository.findByToken(token);
    if (!record || record.expiresAt < new Date()) {
      throw new AppError(400, 'Reset link is invalid or has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userRepository.updatePassword(record.userId, passwordHash);

    await passwordResetTokenRepository.deleteByToken(token);

    await tokenRepository.deleteAllForUser(record.userId);

    const user = await userRepository.findById(record.userId);
    const profile = await profileRepository.findByUserId(record.userId);
    if (user) emailService.sendPasswordChanged(user.email, profile?.fullName ?? 'there');
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'User not found');
    const profile = await profileRepository.findByUserId(userId);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _pw, ...safeUser } = user;
    return { user: safeUser, profile };
  },
};

function parseDuration(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const value = parseInt(match[1]!, 10);
  const unit = match[2]!;
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (multipliers[unit] ?? 86_400_000);
}

async function issueTokens(userId: string, email: string) {
  const jti = randomUUID();
  const accessToken = signAccessToken({ sub: userId, email });
  const refreshToken = signRefreshToken({ sub: userId, jti });

  const refreshMs = parseDuration(env.JWT_REFRESH_EXPIRES_IN);
  await tokenRepository.create({
    id: jti,
    token: refreshToken,
    userId,
    expiresAt: new Date(Date.now() + refreshMs),
  });

  return { accessToken, refreshToken, userId };
}
