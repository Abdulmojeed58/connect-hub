# ConnectHub

A professional networking platform (LinkedIn-style) built as a full-stack TypeScript monorepo.

---

## Table of contents

- [Stack](#stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick setup (recommended)](#quick-setup-recommended)
- [Manual setup](#manual-setup)
- [Running the app](#running-the-app)
- [Environment variables reference](#environment-variables-reference)
- [Available scripts](#available-scripts)
- [API reference](#api-reference)
- [Shared types (mobile repo)](#shared-types-mobile-repo)

---

## Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| API | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase), Prisma ORM |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Email | Resend |
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| State | TanStack React Query (server), Zustand (client) |
| Validation | Zod (backend), react-hook-form + Zod (frontend) |
| Logging | Pino + pino-http, correlation IDs |

---

## Project structure

```
connecthub/
├── apps/
│   ├── api/                    Node.js REST API
│   │   ├── prisma/             Schema + migrations
│   │   └── src/
│   │       ├── config/         env.ts — Zod-validated env (fails fast at startup)
│   │       ├── lib/            prisma.ts, jwt.ts, email.ts, logger.ts
│   │       ├── middleware/     auth, error handler, validation, correlation ID
│   │       ├── routes/         One file per resource
│   │       ├── controllers/    Thin — parse request, call service, send response
│   │       ├── services/       Business logic + ownership checks
│   │       └── repositories/  All Prisma queries (no raw SQL)
│   └── web/                    React SPA
│       └── src/
│           ├── api/            Axios client + per-resource API functions
│           ├── hooks/          React Query + Zustand hooks
│           ├── components/     Feature-based components (pages contain zero logic)
│           ├── pages/          Thin wrappers — render one component each
│           └── store/          Zustand auth store (tokens persisted to localStorage)
└── packages/
    ├── shared-types/           Pure TS interfaces shared by api, web, and mobile
    └── config/                 Shared ESLint + tsconfig presets
```

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 20 | [nodejs.org](https://nodejs.org) |
| pnpm | ≥ 9 | Installed automatically by the setup script via Corepack |
| PostgreSQL | ≥ 15 | Local install **or** a free hosted database (see below) |
| Resend account | — | Free at [resend.com](https://resend.com) — 3,000 emails/month |

**Hosted database options (no local Postgres needed):**

| Provider | Free tier | Notes |
|----------|-----------|-------|
| [Supabase](https://supabase.com) | 500 MB | Gives both a pooled URL (port 6543) and a direct URL (port 5432) |
| [Neon](https://neon.tech) | 512 MB | Serverless PostgreSQL |
| [Railway](https://railway.app) | $5 credit | Easiest setup |

> The project is pre-configured for Supabase connection strings. Any standard PostgreSQL URL works.

---

## Quick setup (recommended)

The setup script checks prerequisites, installs dependencies, generates JWT secrets, prompts for your database and email credentials, and runs migrations — all in one go.

```bash
# 1. Clone the repo
git clone <repo-url>
cd connecthub

# 2. Run the setup script
bash scripts/setup.sh
```

The script will ask for:
- **DATABASE_URL** — your pooled PostgreSQL connection string
- **DIRECT_URL** — your direct (non-pooled) connection string (used for migrations)
- **RESEND_API_KEY** — from [resend.com/api-keys](https://resend.com/api-keys)
- **RESEND_FROM_EMAIL** — the sender address (use `ConnectHub <onboarding@resend.dev>` for the Resend sandbox during local testing)

JWT secrets are generated automatically — you don't need to create them.

Once the script finishes:

```bash
pnpm dev
```

Open **http://localhost:5173** in your browser.

---

## Manual setup

If you prefer to configure things yourself:

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build shared types

```bash
pnpm --filter @connecthub/shared-types build
```

### 3. Configure the API

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` and fill in all values (see [Environment variables reference](#environment-variables-reference)).

Generate JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Run twice — once for JWT_ACCESS_SECRET, once for JWT_REFRESH_SECRET
```

### 4. Configure the web app

```bash
cp apps/web/.env.example apps/web/.env
```

For local development the file can stay empty — the Vite dev server proxies all `/api` requests to `http://localhost:3001` automatically.

### 5. Set up the database

```bash
# Generate the Prisma client
pnpm --filter @connecthub/api run db:generate

# Apply all migrations (creates every table)
pnpm --filter @connecthub/api run db:migrate
```

---

## Running the app

```bash
# Start API (port 3001) and web (port 5173) concurrently
pnpm dev
```

Or individually:

```bash
pnpm --filter @connecthub/api dev
pnpm --filter @connecthub/web dev
```

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Web app |
| http://localhost:3001 | REST API |
| `pnpm --filter @connecthub/api db:studio` | Prisma Studio — visual DB browser |

---

## Environment variables reference

### `apps/api/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | Pooled PostgreSQL connection string. For Supabase use port **6543** with `?pgbouncer=true`. |
| `DIRECT_URL` | ✅ | — | Direct (non-pooled) connection string. For Supabase use port **5432**. Required by Prisma migrations. |
| `JWT_ACCESS_SECRET` | ✅ | — | Min 32-char random string for signing access tokens. |
| `JWT_REFRESH_SECRET` | ✅ | — | Min 32-char random string for signing refresh tokens. Must differ from the access secret. |
| `JWT_ACCESS_EXPIRES_IN` | — | `15m` | Access token TTL (e.g. `15m`, `1h`). |
| `JWT_REFRESH_EXPIRES_IN` | — | `7d` | Refresh token TTL (e.g. `7d`, `30d`). |
| `PORT` | — | `3001` | Port the API listens on. |
| `NODE_ENV` | — | `development` | `development` or `production`. |
| `CORS_ORIGIN` | — | `http://localhost:5173` | Allowed origin for CORS. Set to your production frontend URL in prod. |
| `RESEND_API_KEY` | ✅ | — | API key from [resend.com](https://resend.com). Emails are sent for registration, login, connections, and password reset. |
| `RESEND_FROM_EMAIL` | — | `ConnectHub <onboarding@resend.dev>` | Sender address. Use `onboarding@resend.dev` for the Resend sandbox (no domain verification needed). |
| `FRONTEND_URL` | — | `http://localhost:5173` | Base URL of the web app. Used to build password-reset links in emails. |

### `apps/web/.env`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | — | `""` (empty) | API base URL. Leave empty for local dev — the Vite proxy handles it. Set to your deployed API URL in production. |

---

## Available scripts

Run from the repo root:

```bash
pnpm dev          # Start all apps in development mode (watch + HMR)
pnpm build        # Production build for all apps
pnpm typecheck    # TypeScript check across all packages
pnpm lint         # ESLint across all packages
```

Single app or task:

```bash
pnpm --filter @connecthub/api  dev          # API only
pnpm --filter @connecthub/web  dev          # Web only
pnpm --filter @connecthub/api  db:migrate   # Run pending migrations
pnpm --filter @connecthub/api  db:generate  # Regenerate Prisma client after schema change
pnpm --filter @connecthub/api  db:studio    # Open Prisma Studio (visual DB browser)
```

---

## API reference

Base URL: `http://localhost:3001`

All responses use a consistent envelope:

```json
{ "success": true,  "data": { … } }
{ "success": false, "error": "Human-readable message" }
```

Protected routes require `Authorization: Bearer <accessToken>`.

### Auth

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| POST | `/api/auth/register` | | Create account, receive tokens |
| POST | `/api/auth/login` | | Login, receive tokens |
| POST | `/api/auth/logout` | ✅ | Invalidate refresh token |
| POST | `/api/auth/refresh` | | Exchange refresh token for new token pair |
| GET | `/api/auth/me` | ✅ | Current user + profile |
| POST | `/api/auth/change-password` | ✅ | Change password (requires current password, revokes all sessions) |
| POST | `/api/auth/forgot-password` | | Request a password-reset email (always returns success) |
| POST | `/api/auth/reset-password` | | Set new password using the token from the reset email |

### Profiles

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| GET | `/api/profiles/:userId` | ✅ | Get any user's full profile |
| PUT | `/api/profiles/me` | ✅ | Update own profile |
| POST | `/api/profiles/me/experience` | ✅ | Add experience entry |
| PUT | `/api/profiles/me/experience/:id` | ✅ | Edit experience entry |
| DELETE | `/api/profiles/me/experience/:id` | ✅ | Delete experience entry |
| POST | `/api/profiles/me/education` | ✅ | Add education entry |
| PUT | `/api/profiles/me/education/:id` | ✅ | Edit education entry |
| DELETE | `/api/profiles/me/education/:id` | ✅ | Delete education entry |

### Users

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| GET | `/api/users` | ✅ | Browse members — paginated, supports `?page=`, `?limit=`, `?search=` |

### Connections

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| POST | `/api/connections/request/:userId` | ✅ | Send connection request |
| GET | `/api/connections` | ✅ | List accepted connections (supports `?search=`) |
| GET | `/api/connections/pending` | ✅ | Incoming pending requests (supports `?search=`) |
| GET | `/api/connections/sent` | ✅ | Outgoing pending requests |
| POST | `/api/connections/:id/accept` | ✅ | Accept a request |
| POST | `/api/connections/:id/decline` | ✅ | Decline a request |
| DELETE | `/api/connections/:id` | ✅ | Remove connection or withdraw request |

### Notifications

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| GET | `/api/notifications` | ✅ | List activity notifications |

---

## Shared types (mobile repo)

`packages/shared-types` contains only TypeScript interfaces — zero runtime code, safe to import anywhere.

It covers all domain models (`User`, `Profile`, `Experience`, `Education`, `Connection`, `Notification`) and every API request/response shape, keeping the backend, web, and any mobile client in sync.

To use in a separate mobile repo, either:

1. **Publish** the package to npm or a private registry, then add it as a dependency, or
2. **Copy** `packages/shared-types/src/` into the mobile repo directly.
