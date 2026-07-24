import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '@/config/env';
import { prisma } from '@/config/prisma';
import { AppError } from '@/middleware/error.middleware';
import type { AuthPayload } from '@/middleware/auth.middleware';
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput } from './auth.schema';

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─── Token helpers ────────────────────────────────────────────

function signAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
}

// ─── Service methods ──────────────────────────────────────────

export async function login(input: LoginInput) {
  const cleanEmail = input.email.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: { employee: { email: { equals: cleanEmail, mode: 'insensitive' } } },
    include: {
      employee: { select: { id: true, name: true, email: true, companyId: true, role: true } },
    },
  });

  if (!user || !user.hasAccess) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const payload: AuthPayload = {
    userId: user.id,
    employeeId: user.employee.id,
    companyId: user.employee.companyId,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(user.id);

  // Fast SHA-256 hash for stored refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: hashToken(refreshToken) },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.employee.id,
      name: user.employee.name,
      email: user.employee.email,
      role: user.role,
      title: user.employee.role,
    },
  };
}

export async function logout(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash: null },
  });
}

export async function refresh(refreshToken: string) {
  let decoded: { userId: string };
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Refresh token is invalid or expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { employee: { select: { id: true, companyId: true } } },
  });

  if (!user?.refreshTokenHash || !user.hasAccess) {
    throw new AppError(401, 'INVALID_TOKEN', 'Refresh token has been revoked');
  }

  const valid = hashToken(refreshToken) === user.refreshTokenHash;
  if (!valid) {
    throw new AppError(401, 'INVALID_TOKEN', 'Refresh token is invalid');
  }

  const newPayload: AuthPayload = {
    userId: user.id,
    employeeId: user.employee.id,
    companyId: user.employee.companyId,
    role: user.role,
  };
  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: hashToken(newRefreshToken) },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const user = await prisma.user.findFirst({
    where: { employee: { email: { equals: input.email.trim().toLowerCase(), mode: 'insensitive' } } },
    include: { employee: { select: { email: true } } },
  });

  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });
}

export async function resetPassword(input: ResetPasswordInput) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: input.token,
      resetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(400, 'INVALID_TOKEN', 'Reset token is invalid or has expired');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
      refreshTokenHash: null,
    },
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      employee: { select: { id: true, name: true, email: true, role: true, avatarColor: true } },
    },
  });
  if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
  return {
    id: user.employee.id,
    name: user.employee.name,
    email: user.employee.email,
    role: user.role,
    title: user.employee.role,
    avatarColor: user.employee.avatarColor,
  };
}
