#!/usr/bin/env bash
# deploy.sh — sync and (re)start the site on your VPS
# Usage: ./deploy.sh user@your-vps-ip
#
# Requires:
#   - SSH access to the VPS
#   - Docker + Docker Compose v2 on the VPS
#   - The `proxy` Docker network already exists (created by Traefik)
#   - A .env file in this directory with DOMAIN set

set -euo pipefail

REMOTE="${1:?Usage: ./deploy.sh user@your-vps-ip}"
REMOTE_DIR="/opt/marihella-vintage"

echo "▶ Syncing files to ${REMOTE}:${REMOTE_DIR} ..."
ssh "${REMOTE}" "sudo mkdir -p ${REMOTE_DIR} && sudo chown \$(id -u):\$(id -g) ${REMOTE_DIR}"
tar --exclude='./.git' \
    --exclude='./node_modules' \
    --exclude='./dist' \
    --exclude='./.astro' \
    -czf - . \
  | ssh "${REMOTE}" "tar -xzf - -C ${REMOTE_DIR}"

echo "▶ Deploying on remote ..."
ssh "${REMOTE}" bash -s <<EOF
  set -euo pipefail
  cd "${REMOTE_DIR}"

  if [ ! -f .env ]; then
    cp .env.example .env
    echo ""
    echo "⚠️  Created .env from .env.example — edit DOMAIN if needed:"
    echo "    ssh ${REMOTE} 'nano ${REMOTE_DIR}/.env'"
    exit 1
  fi

  docker compose up -d --build --remove-orphans
  docker image prune -f
EOF

echo "✅ Done — site live at https://$(grep DOMAIN .env | cut -d= -f2)"
