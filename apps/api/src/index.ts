import './config/env.js'; // Validates env vars — must be first import
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, `API running on http://localhost:${env.PORT}`);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received — shutting down');
  await prisma.$disconnect();
  process.exit(0);
});
