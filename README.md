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

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A PostgreSQL database — [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app)
- A [Resend](https://resend.com) account



### Setup

```bash
cp .env.example .env
```

Fill in `.env` with your values (see [Environment variables](#environment-variables) below), then:

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

---



## Running locally



### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)



### Setup

```bash
pnpm install
pnpm --filter @connecthub/shared-types build

cp apps/api/.env.example apps/api/.env
# Fill in apps/api/.env

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



### `.env` — Docker (root)


| Variable                 | Required | Description                                                                                                    |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | ✅        | Pooled PostgreSQL URL. Supabase: port **6543** with `?pgbouncer=true`                                          |
| `DIRECT_URL`             | ✅        | Direct PostgreSQL URL. Supabase: port **5432**. Used by Prisma migrations                                      |
| `JWT_ACCESS_SECRET`      | ✅        | Random string ≥ 32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_REFRESH_SECRET`     | ✅        | Same as above — must be different from `JWT_ACCESS_SECRET`                                                     |
| `RESEND_API_KEY`         | ✅        | From [resend.com/api-keys](https://resend.com/api-keys)                                                        |
| `RESEND_FROM_EMAIL`      | —        | Sender address. Default: `ConnectHub <onboarding@resend.dev>`                                                  |
| `JWT_ACCESS_EXPIRES_IN`  | —        | Default: `15m`                                                                                                 |
| `JWT_REFRESH_EXPIRES_IN` | —        | Default: `7d`                                                                                                  |




### `apps/api/.env` — local dev

Same variables as above, plus:


| Variable       | Required | Description                                                     |
| -------------- | -------- | --------------------------------------------------------------- |
| `NODE_ENV`     | —        | Default: `development`                                          |
| `CORS_ORIGIN`  | —        | Default: `http://localhost:5173`                                |
| `FRONTEND_URL` | —        | Used in password-reset emails. Default: `http://localhost:5173` |
| `PORT`         | —        | Default: `3001`                                                 |




### `apps/mobile/.env`


| Variable              | Required | Description                                   |
| --------------------- | -------- | --------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | ✅        | Full API URL, e.g. `http://192.168.1.42:3001` |


