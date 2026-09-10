#!/usr/bin/env bash
# Sync brand assets from Google Drive source-of-truth into the website repo.
# Run after updating assets, then commit the result.
set -euo pipefail

BRAND="$HOME/Library/CloudStorage/GoogleDrive-info@tovy.eu/My Drive/03-resources/tovy-brand-assets"

if [ ! -d "$BRAND" ]; then
  echo "Brand assets directory not found: $BRAND" >&2
  exit 1
fi

cp "$BRAND/web/favicon.ico"        src/app/favicon.ico
cp "$BRAND/web/apple-touch-icon.png" public/apple-touch-icon.png
cp "$BRAND/web/icon-512.png"       public/icon-512.png
cp "$BRAND/social/og-1200x630.png" public/images/tovy-og-image.png
cp "$BRAND/svg/wordmark-on-ink.svg" public/images/tovy-wordmark.svg

echo "Brand assets synced."
