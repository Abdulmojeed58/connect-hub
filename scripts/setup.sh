#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# ConnectHub — one-time setup script
# Run from the repo root: bash scripts/setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
RESET='\033[0m'

info()    { echo -e "${CYAN}${BOLD}[setup]${RESET} $*"; }
success() { echo -e "${GREEN}${BOLD}[✓]${RESET} $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[!]${RESET} $*"; }
error()   { echo -e "${RED}${BOLD}[✗]${RESET} $*" >&2; exit 1; }
ask()     { echo -e "${BOLD}$*${RESET}"; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║       ConnectHub  —  Project Setup       ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# 1. Prerequisites
# ─────────────────────────────────────────────────────────────────────────────
info "Checking prerequisites…"

# Node.js ≥ 20
if ! command -v node &>/dev/null; then
  error "Node.js is not installed. Download it from https://nodejs.org (v20 or newer)."
fi
NODE_MAJOR=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt 20 ]; then
  error "Node.js v20+ is required (found v$(node -v)). Update at https://nodejs.org."
fi
success "Node.js $(node -v)"

# pnpm
if ! command -v pnpm &>/dev/null; then
  warn "pnpm not found. Installing via Corepack…"
  corepack enable
  corepack prepare pnpm@latest --activate
fi
success "pnpm $(pnpm -v)"

# ─────────────────────────────────────────────────────────────────────────────
# 2. Install dependencies
# ─────────────────────────────────────────────────────────────────────────────
info "Installing dependencies (this may take a minute)…"
pnpm install --frozen-lockfile
success "Dependencies installed"

# ─────────────────────────────────────────────────────────────────────────────
# 3. Build shared-types (api + web both depend on it)
# ─────────────────────────────────────────────────────────────────────────────
info "Building shared-types package…"
pnpm --filter @connecthub/shared-types build
success "shared-types built"

# ─────────────────────────────────────────────────────────────────────────────
# 4. API environment variables
# ─────────────────────────────────────────────────────────────────────────────
API_ENV="apps/api/.env"

if [ -f "$API_ENV" ]; then
  warn "$API_ENV already exists."
  read -rp "  Overwrite it? (y/N) " OVERWRITE
  if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
    info "Skipping API .env — using existing file."
    SKIP_API_ENV=true
  fi
fi

if [ "${SKIP_API_ENV:-false}" = "false" ]; then
  echo ""
  info "Configuring API environment…"
  echo "  You'll need:"
  echo "    • A PostgreSQL database (Supabase free tier works great)"
  echo "    • A Resend API key (free at https://resend.com)"
  echo ""

  # Database URLs
  ask "DATABASE_URL — pooled connection string (port 6543 for Supabase):"
  read -rp "  > " DB_URL
  [ -z "$DB_URL" ] && error "DATABASE_URL cannot be empty."

  ask "DIRECT_URL — direct connection string (port 5432, used for migrations):"
  read -rp "  > " DIRECT_URL
  [ -z "$DIRECT_URL" ] && error "DIRECT_URL cannot be empty."

  # Resend
  ask "RESEND_API_KEY (from https://resend.com/api-keys):"
  read -rp "  > " RESEND_KEY
  [ -z "$RESEND_KEY" ] && error "RESEND_API_KEY cannot be empty."

  ask "RESEND_FROM_EMAIL (e.g. 'ConnectHub <onboarding@resend.dev>' for sandbox):"
  read -rp "  > " RESEND_FROM
  RESEND_FROM="${RESEND_FROM:-ConnectHub <onboarding@resend.dev>}"

  # Auto-generate JWT secrets
  JWT_ACCESS_SECRET=$(node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))")
  JWT_REFRESH_SECRET=$(node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))")
  success "JWT secrets generated"

  cat > "$API_ENV" <<EOF
# ─── Database ─────────────────────────────────────────────────────────────────
DATABASE_URL="${DB_URL}"
DIRECT_URL="${DIRECT_URL}"

# ─── JWT ──────────────────────────────────────────────────────────────────────
JWT_ACCESS_SECRET="${JWT_ACCESS_SECRET}"
JWT_REFRESH_SECRET="${JWT_REFRESH_SECRET}"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# ─── Server ───────────────────────────────────────────────────────────────────
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"

# ─── Email (Resend) ───────────────────────────────────────────────────────────
RESEND_API_KEY="${RESEND_KEY}"
RESEND_FROM_EMAIL="${RESEND_FROM}"

# ─── Frontend URL ─────────────────────────────────────────────────────────────
FRONTEND_URL="http://localhost:5173"
EOF
  success "$API_ENV written"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 5. Web environment variables
# ─────────────────────────────────────────────────────────────────────────────
WEB_ENV="apps/web/.env"
if [ ! -f "$WEB_ENV" ]; then
  cp apps/web/.env.example "$WEB_ENV"
  success "$WEB_ENV created (Vite proxy enabled — no changes needed for local dev)"
else
  info "$WEB_ENV already exists — skipping"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 6. Prisma — generate client + run migrations
# ─────────────────────────────────────────────────────────────────────────────
info "Generating Prisma client…"
pnpm --filter @connecthub/api run db:generate
success "Prisma client generated"

info "Running database migrations…"
pnpm --filter @connecthub/api run db:migrate
success "Database migrations applied"

# ─────────────────────────────────────────────────────────────────────────────
# 7. Done
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║          Setup complete! 🎉              ║${RESET}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  Start the app:  ${BOLD}pnpm dev${RESET}"
echo -e "  Frontend:       ${CYAN}http://localhost:5173${RESET}"
echo -e "  API:            ${CYAN}http://localhost:3001${RESET}"
echo -e "  DB studio:      ${BOLD}pnpm --filter @connecthub/api db:studio${RESET}"
echo ""
