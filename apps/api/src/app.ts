import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { correlationMiddleware } from './middleware/correlation.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { profileRouter } from './routes/profile.routes.js';
import { userRouter } from './routes/user.routes.js';
import { connectionRouter } from './routes/connection.routes.js';
import { notificationRouter } from './routes/notification.routes.js';

const httpLogger = pinoHttp({
  logger,
  // Use the correlationId we attached in correlationMiddleware as the request ID.
  // Cast needed because pino-http types req as IncomingMessage, not Express Request.
  genReqId: (req) => (req as unknown as Express.Request).correlationId,
  // Suppress logging for health checks to avoid noise
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
  // Log 5xx as error, 4xx as warn, everything else as info
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  // Shape of the logged request object
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      correlationId: req.id,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use(correlationMiddleware);
  app.use(httpLogger);

  app.get('/', (_req, res) => res.json({ status: 'ok' }));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter);
  app.use('/api/profiles', profileRouter);
  app.use('/api/users', userRouter);
  app.use('/api/connections', connectionRouter);
  app.use('/api/notifications', notificationRouter);

  app.use(errorHandler);

  return app;
}
