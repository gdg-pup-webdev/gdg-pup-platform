#!/usr/bin/env sh
# filepath: d:\Linux\GDG-PUP\gdg-pup-platform\.scripts\clean.sh
set -e

echo "=== Stopping Turbo daemon ==="
turbo daemon stop || echo "Turbo daemon already stopped"

echo "=== Cleaning build artifacts ==="
npx rimraf "**/dist" "dist"

echo "=== Cleaning cache files ==="
npx rimraf ".turbo" "**/.turbo" ".next" "**/.next" ".vite" "**/.vite" "node_modules/.cache" "**/node_modules/.cache" "node_modules/.vite" "**/node_modules/.vite"

echo "=== Cleaning log files ==="
npx rimraf "*.log" "**/*.log" "logs" "**/logs"

echo "✨ Clean complete! Run pnpm install to reinstall dependencies."