import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn(
      { correlationId: req.correlationId, statusCode: err.statusCode },
      err.message,
    );
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  logger.error(
    { correlationId: req.correlationId, err },
    'Unhandled error',
  );
  res.status(500).json({ success: false, error: 'Internal server error' });
}
