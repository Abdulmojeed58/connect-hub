import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export function correlationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-correlation-id'] as string | undefined) ?? randomUUID();
  req.correlationId = id;
  res.setHeader('X-Correlation-Id', id);
  next();
}
