# ConnectHub

A professional networking platform (LinkedIn-style) built as a full-stack TypeScript monorepo.

---

## Project structure

```
connecthub/
├── apps/
│   ├── api/           Node.js + Express REST API (TypeScript, Prisma)
│   ├── web/           React SPA (Vite, Tailwind CSS, shadcn/ui)
│   └── mobile/        Expo (React Native) app
└── packages/
    ├── shared-types/  TypeScript interfaces shared across all apps
    └── config/        Shared ESLint + tsconfig presets
```

---

## Running with Docker

The easiest way to run the app locally. Includes a PostgreSQL database — no external database account needed.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

The docker desktop should be opened

### Setup

```bash
cp .env.example .env
```

Open `.env` and fill in the two JWT secrets (everything else is optional for local use): (All other environment variabke can be ignored if using docker)

```env
JWT_ACCESS_SECRET="<random 32+ char string>"
JWT_REFRESH_SECRET="<random 32+ char string>"
```

Generate secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then start everything:

```bash
docker compose up --build
```

| URL                                            |         |
| ---------------------------------------------- | ------- |
| [http://localhost](http://localhost)           | Web app |
| [http://localhost:3001](http://localhost:3001) | API     |

The API runs database migrations automatically on startup. To stop:

```bash
docker compose down
```

To also delete the database volume:

```bash
docker compose down -v
```

---

## Running locally (manual)

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- A PostgreSQL database — [Supabase](https://supabase.com), [Neon](https://neon.tech), or any PostgreSQL instance

### Setup

```bash
pnpm install
pnpm --filter @connecthub/shared-types build

cp .env.example .env
# Fill in .env with your DATABASE_URL, DIRECT_URL, and JWT secrets

pnpm --filter @connecthub/api run db:generate
pnpm --filter @connecthub/api run db:migrate

pnpm dev
```

| URL                                            |         |
| ---------------------------------------------- | ------- |
| [http://localhost:5173](http://localhost:5173) | Web app |
| [http://localhost:3001](http://localhost:3001) | API     |

---

## Mobile (Expo)

```bash
cd apps/mobile
npm install
```

Create `apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=http://<your-machine-ip>:3001
```

```bash
npx expo start
```

Use your machine's LAN IP (not `localhost`) so the device/simulator can reach the API.

---

## Environment variables

### `.env` — Docker / local dev

| Variable                 | Required | Description                                                                                                    |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | Docker: auto | Pooled PostgreSQL URL. Auto-set by Docker Compose. Manual dev: provide your own |
| `DIRECT_URL`             | Docker: auto | Direct PostgreSQL URL for Prisma migrations. Auto-set by Docker Compose |
| `JWT_ACCESS_SECRET`      | ✅        | Random string ≥ 32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_REFRESH_SECRET`     | ✅        | Same as above — must be different from `JWT_ACCESS_SECRET`                                                     |
| `RESEND_API_KEY`         | —        | From [resend.com/api-keys](https://resend.com/api-keys). If omitted, emails are skipped but the app still works |
| `RESEND_FROM_EMAIL`      | —        | Sender address. Default: `ConnectHub <onboarding@resend.dev>`                                                  |
| `JWT_ACCESS_EXPIRES_IN`  | —        | Default: `15m`                                                                                                 |
| `JWT_REFRESH_EXPIRES_IN` | —        | Default: `7d`                                                                                                  |
| `PORT`                   | —        | Default: `3001`                                                                                                 |
| `CORS_ORIGIN`            | —        | Default: `http://localhost:5173`                                                                                |
| `FRONTEND_URL`           | —        | Used in password-reset emails. Default: `http://localhost:5173`                                                |

### `apps/mobile/.env`

| Variable              | Required | Description                                   |
| --------------------- | -------- | --------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | ✅        | Full API URL, e.g. `http://192.168.1.42:3001` |
