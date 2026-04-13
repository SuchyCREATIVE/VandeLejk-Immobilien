#!/bin/bash
set -e

MODE=${1:-preview}
PROJECT="vandelejk-immobilien"
SSH_USER="web6"
SSH_HOST="hosting.suchycreative.de"

if [ "$MODE" = "preview" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/${PROJECT}.scpreview.de"
  URL="https://${PROJECT}.scpreview.de"
elif [ "$MODE" = "live" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/vandelejk-immobilien.de"
  URL="https://vandelejk-immobilien.de"
else
  echo "Verwendung: ./deploy.sh preview|live"
  exit 1
fi

echo "▶ Git: Änderungen committen & pushen..."
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M') [$MODE]"
fi
git push origin main

echo "▶ Quellcode übertragen..."
rsync -avz --delete \
  --exclude='.git' \
  --exclude='.env*' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='*.db' \
  --exclude='*.db-shm' \
  --exclude='*.db-wal' \
  --exclude='public/uploads' \
  --exclude='data' \
  ./ "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/"

echo "▶ Auf Server installieren & bauen..."
ssh "${SSH_USER}@${SSH_HOST}" "bash -s" << ENDSSH
  export PATH=\$HOME/.npm-global/bin:/opt/plesk/node/25/bin:\$PATH
  cd "${REMOTE_PATH}"
  npm install --include=dev
  npm run db:push
  npm run db:generate
  npm run db:seed
  npm run build
  npm prune --production
ENDSSH

echo "▶ Passenger neu starten..."
ssh "${SSH_USER}@${SSH_HOST}" "bash -s" << ENDSSH
  mkdir -p "${REMOTE_PATH}/tmp"
  touch "${REMOTE_PATH}/tmp/restart.txt"
ENDSSH

echo "▶ Warten bis die Seite antwortet..."
MAX=60
i=0
while [ $i -lt $MAX ]; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null)
  if [ "$STATUS" = "200" ]; then
    break
  fi
  sleep 3
  i=$((i + 3))
done

echo ""
if [ "$STATUS" = "200" ]; then
  echo "✓ Deployed: $URL"
else
  echo "⚠ Deploy abgeschlossen, aber Seite antwortet noch nicht (HTTP $STATUS). Bitte in ~30s erneut laden."
fi
