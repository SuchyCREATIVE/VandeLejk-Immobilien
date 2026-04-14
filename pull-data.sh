#!/bin/bash
# Holt Datenbank und Uploads vom Preview-Server lokal
set -e

MODE=${1:-preview}
PROJECT="vandelejk-immobilien"
SSH_USER="web6"
SSH_HOST="hosting.suchycreative.de"

if [ "$MODE" = "preview" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/${PROJECT}.scpreview.de"
elif [ "$MODE" = "live" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/vandelejk-immobilien.de"
else
  echo "Verwendung: ./pull-data.sh preview|live"
  exit 1
fi

echo "▶ Datenbank holen..."
rsync -avz \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/prisma/dev.db" \
  ./prisma/dev.db

echo "▶ Uploads holen..."
rsync -avz \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/public/uploads/" \
  ./public/uploads/

echo "✓ Fertig – DB und Uploads sind lokal aktuell."
