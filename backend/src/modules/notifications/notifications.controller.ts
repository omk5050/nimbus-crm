import type { Request, Response } from 'express';
import * as svc from './notifications.service';

export async function list(req: Request, res: Response) {
  res.json(await svc.listNotifications(req.auth.userId));
}

export async function markAsRead(req: Request, res: Response) {
  res.json(await svc.markAsRead(req.auth.userId, req.params.id));
}

export async function markAllAsRead(req: Request, res: Response) {
  await svc.markAllAsRead(req.auth.userId);
  res.status(204).send();
}

export async function deleteOne(req: Request, res: Response) {
  await svc.deleteNotification(req.auth.userId, req.params.id);
  res.status(204).send();
}

export async function clearAll(req: Request, res: Response) {
  await svc.clearAll(req.auth.userId);
  res.status(204).send();
}
