#!/usr/bin/env fish
# filepath: scripts/clean/extra/clean.fish
# Fish Shell clean script for GDG PUP Platform

echo "=== Stopping Turbo daemon ==="
turbo daemon stop; or echo "Turbo daemon already stopped"

echo "=== Cleaning build artifacts ==="
npx rimraf "**/dist" "dist"

echo "=== Cleaning cache files ==="
npx rimraf ".turbo" "**/.turbo" ".next" "**/.next" ".vite" "**/.vite" "node_modules/.cache" "**/node_modules/.cache" "node_modules/.vite" "**/node_modules/.vite"

echo "=== Cleaning log files ==="
npx rimraf "*.log" "**/*.log" "logs" "**/logs"

echo "=== Cleaning lock files ==="
npx rimraf "pnpm-lock.yaml" "**/pnpm-lock.yaml"

echo "✨ Clean complete! Run pnpm install to reinstall dependencies."