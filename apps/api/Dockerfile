FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# ── Install dependencies ────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared-types/package.json packages/shared-types/
COPY packages/config/package.json          packages/config/
COPY apps/api/package.json                 apps/api/
RUN pnpm install --frozen-lockfile

# ── Build ───────────────────────────────────────────────────────────────────────
FROM deps AS builder
COPY packages/ packages/
COPY apps/api/ apps/api/
RUN pnpm --filter @connecthub/shared-types build
RUN pnpm --filter @connecthub/api exec prisma generate
RUN pnpm --filter @connecthub/api build

# ── Production image ────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Root node_modules contains the pnpm virtual store (.pnpm) that local
# node_modules symlink into — both must be present for resolution to work.
COPY --from=builder /app/node_modules          ./node_modules
COPY --from=builder /app/packages              ./packages
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist         ./apps/api/dist
COPY --from=builder /app/apps/api/prisma       ./apps/api/prisma
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Run pending migrations then start the server
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]
