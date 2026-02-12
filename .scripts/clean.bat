@echo off
echo === Stopping Turbo daemon ===
turbo daemon stop 2>nul || echo Turbo daemon already stopped

echo === Cleaning build artifacts ===
rimraf "**/dist" "dist"

echo === Cleaning cache files ===
rimraf ".turbo" "**/.turbo" ".next" "**/.next" ".vite" "**/.vite" "node_modules/.cache" "**/node_modules/.cache" "node_modules/.vite" "**/node_modules/.vite"

echo === Cleaning log files ===
rimraf "*.log" "**/*.log" "logs" "**/logs"

echo Clean complete! Run pnpm install to reinstall dependencies.