#!/usr/bin/env bash
set -euo pipefail

# ─── Config ───────────────────────────────────────────────────────────────────
APP_DIR="/var/www/cofounderly"
BRANCH="${1:-master}"

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

step()  { echo -e "\n${CYAN}▶ $1${NC}"; }
ok()    { echo -e "${GREEN}✔ $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠ $1${NC}"; }
fail()  { echo -e "${RED}✖ $1${NC}"; exit 1; }

# ─── Start ────────────────────────────────────────────────────────────────────
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  Cofounderly Deploy — branch: ${BRANCH}${NC}"
echo -e "${CYAN}  $(date '+%Y-%m-%d %H:%M:%S %Z')${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$APP_DIR" || fail "Cannot cd to $APP_DIR"

# ─── 1. Pull latest code ──────────────────────────────────────────────────────
step "Pulling latest code ($BRANCH)"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
ok "Code updated — $(git log -1 --format='%h %s')"

# ─── 2. PHP dependencies ──────────────────────────────────────────────────────
step "Installing PHP dependencies (no-dev)"
composer install --no-dev --optimize-autoloader --no-scripts --no-interaction
ok "Composer done"

# ─── 3. Clear stale bootstrap cache ──────────────────────────────────────────
step "Clearing bootstrap cache"
rm -f bootstrap/cache/*.php
ok "Cache cleared"

# ─── 4. Package discovery ─────────────────────────────────────────────────────
step "Running package discovery"
php artisan package:discover --ansi
ok "Packages discovered"

# ─── 5. Generate Wayfinder types (must run before npm build) ─────────────────
step "Generating Wayfinder types"
php artisan wayfinder:generate --with-form
ok "Wayfinder types generated"

# ─── 6. Frontend assets ───────────────────────────────────────────────────────
step "Installing JS dependencies"
npm ci --silent
ok "npm ci done"

step "Building frontend assets"
npm run build
ok "Frontend built"

# ─── 7. Database migrations ───────────────────────────────────────────────────
step "Running migrations"
php artisan migrate --force
ok "Migrations done"

# ─── 8. Seed roles (idempotent) ───────────────────────────────────────────────
step "Seeding roles"
php artisan db:seed --class=RoleSeeder --force
ok "Roles seeded"

# ─── 9. Cache config / routes / views ────────────────────────────────────────
step "Caching config, routes and views"
php artisan optimize
ok "Optimize done"

# ─── 10. Restart queue workers ────────────────────────────────────────────────
step "Restarting queue workers"
php artisan queue:restart
ok "Queue restart signal sent"

# ─── 11. Restart Reverb (if running under a process manager) ─────────────────
step "Restarting Reverb"
if command -v supervisorctl &>/dev/null; then
    supervisorctl restart reverb 2>/dev/null && ok "Reverb restarted via Supervisor" || warn "Reverb not found in Supervisor — restart it manually if needed"
else
    warn "Supervisor not found — restart Reverb manually: php artisan reverb:start --daemon"
fi

# ─── Done ─────────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Deploy complete — $(date '+%Y-%m-%d %H:%M:%S %Z')${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
