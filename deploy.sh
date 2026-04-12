#!/bin/bash
set -e

MODE=${1:-preview}
PROJECT="vandelejk-immobilien"
SSH_USER="web6"
SSH_HOST="hosting.suchycreative.de"

if [ "$MODE" = "preview" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/${PROJECT}.scpreview.de/"
  URL="https://${PROJECT}.scpreview.de"
elif [ "$MODE" = "live" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/vandelejk-immobilien.de/"
  URL="https://vandelejk-immobilien.de"
else
  echo "Verwendung: ./deploy.sh preview|live"
  exit 1
fi

echo "▶ Build..."
npm run build

echo "▶ Deploy nach $URL ..."
rsync -avz --delete \
  --exclude='.git' \
  --exclude='.env*' \
  --exclude='node_modules' \
  --exclude='.next/cache' \
  --exclude='*.db' \
  --exclude='*.db-shm' \
  --exclude='*.db-wal' \
  ./ "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"

echo "▶ PM2 neu starten..."
ssh "${SSH_USER}@${SSH_HOST}" "cd ${REMOTE_PATH} && npm install --production && pm2 restart ${PROJECT} || pm2 start npm --name ${PROJECT} -- start"

echo ""
echo "✓ Deployed: $URL"
