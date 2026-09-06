# ConnectHub

A professional networking platform (LinkedIn-style clone) built for the Abbey FullStack Engineer Challenge.

This repository contains the **web frontend** and **REST API backend**. The mobile app lives in a separate repository and consumes the same API documented below.

---

## Architecture

```
connecthub/
├── apps/
│   ├── api/          Node.js + Express + TypeScript (REST API + Prisma + PostgreSQL)
│   └── web/          React + TypeScript + Vite + Tailwind CSS
└── packages/
    ├── shared-types/ Pure TypeScript interfaces shared by api, web, and the mobile repo
    └── config/       Shared ESLint + tsconfig presets
```

Task orchestration: **pnpm workspaces + Turborepo** — `dev`, `build`, `lint`, and `typecheck` run across all apps with caching and dependency-graph awareness.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| pnpm | >= 9 (installed automatically via Corepack) |
| PostgreSQL | >= 15 (local or hosted — see below) |

---

## Local setup

### 1. Clone and install

```bash
git clone <repo-url>
cd connecthub
pnpm install
```

### 2. Configure environment variables

**API** — copy the example and fill in your values:

```bash
cp apps/api/.env.example apps/api/.env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/connecthub` |
| `JWT_ACCESS_SECRET` | Min 32-char secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Min 32-char secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL (default: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (default: `7d`) |
| `PORT` | API port (default: `3001`) |
| `NODE_ENV` | `development` \| `production` |
| `CORS_ORIGIN` | Web app origin (default: `http://localhost:5173`) |

**Web** — optional; the Vite dev server proxies `/api` to `localhost:3001` by default:

```bash
cp apps/web/.env.example apps/web/.env
```

### 3. Set up the database

```bash
# Run migrations (creates all tables)
pnpm --filter @connecthub/api db:migrate

# Generate the Prisma client (also runs automatically after install)
pnpm --filter @connecthub/api db:generate
```

> **Hosted PostgreSQL (no local Postgres needed):** Free options include [Neon](https://neon.tech), [Supabase](https://supabase.com), and [Railway](https://railway.app). Copy the connection string they give you into `DATABASE_URL`.

---

## Running the apps

```bash
# Start both api (port 3001) and web (port 5173) concurrently
pnpm dev
```

Or run them individually:

```bash
pnpm --filter @connecthub/api dev
pnpm --filter @connecthub/web dev
```

Open `http://localhost:5173` in your browser.

---

## Other scripts

```bash
pnpm build       # Production build for all apps
pnpm typecheck   # TypeScript check across all packages
pnpm lint        # ESLint across all packages
```

Individual app:
```bash
pnpm --filter @connecthub/api db:studio   # Open Prisma Studio (visual DB browser)
```

---

## API overview

Base URL: `http://localhost:3001`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, get tokens |
| POST | `/api/auth/logout` | Bearer | Invalidate refresh token |
| GET | `/api/auth/me` | Bearer | Current user + profile |
| GET | `/api/profiles/:userId` | Bearer | View any user's profile |
| PUT | `/api/profiles/me` | Bearer | Update own profile |
| POST | `/api/profiles/me/experience` | Bearer | Add experience |
| POST | `/api/profiles/me/education` | Bearer | Add education |
| GET | `/api/users` | Bearer | Browse users (paginated) |
| POST | `/api/connections/request/:userId` | Bearer | Send connection request |
| POST | `/api/connections/:id/accept` | Bearer | Accept request |
| POST | `/api/connections/:id/decline` | Bearer | Decline request |
| DELETE | `/api/connections/:id` | Bearer | Remove connection |
| GET | `/api/connections` | Bearer | List accepted connections |
| GET | `/api/connections/pending` | Bearer | List pending incoming requests |
| GET | `/api/notifications` | Bearer | List activity notifications |

All responses follow the envelope: `{ success: true, data: … }` or `{ success: false, error: "…" }`.

Auth: pass the access token as `Authorization: Bearer <token>` on protected routes.

---

## Shared types (mobile repo)

`packages/shared-types` contains only TypeScript interfaces — zero runtime code. To use it in the mobile repo, either:

1. **Publish** the package to npm/a private registry and add it as a dependency, or
2. **Copy** `packages/shared-types/src/` into the mobile repo directly.

The types cover all domain models (`User`, `Profile`, `Experience`, `Education`, `Connection`, `Notification`) and every API request/response shape, so both clients stay in sync with the backend.

---

## Project structure (api)

```
apps/api/src/
├── config/       env.ts — zod-validated env (fails fast at startup)
├── lib/          prisma.ts, jwt.ts
├── middleware/   auth, error handler, zod request validation
├── routes/       one file per resource
├── controllers/  thin — calls service, sends response
├── services/     business logic
└── repositories/ all Prisma queries
```
