import type { Request, Response } from 'express';
import * as authService from './auth.service';
import { loginSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema, refreshSchema } from './auth.schema';

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.json(result);
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.auth.userId);
  res.status(204).send();
}

export async function refresh(req: Request, res: Response) {
  const input = refreshSchema.parse(req.body);
  const result = await authService.refresh(input.refreshToken);
  res.json(result);
}

export async function forgotPassword(req: Request, res: Response) {
  const input = forgotPasswordSchema.parse(req.body);
  const result = await authService.forgotPassword(input);
  res.json(result);
}

export async function verifyOtp(req: Request, res: Response) {
  const input = verifyOtpSchema.parse(req.body);
  const result = await authService.verifyOtp(input);
  res.json(result);
}

export async function resetPassword(req: Request, res: Response) {
  const input = resetPasswordSchema.parse(req.body);
  const result = await authService.resetPassword(input);
  res.json(result);
}

export async function getMe(req: Request, res: Response) {
  const user = await authService.getMe(req.auth.userId);
  res.json(user);
}
