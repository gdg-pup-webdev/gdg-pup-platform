#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { rimraf } from "rimraf";

const GROUPS: Array<{ label: string; paths: string[] }> = [
  {
    label: "build artifacts",
    paths: ["**/dist", "dist"],
  },
  {
    label: "cache files",
    paths: [
      ".turbo",
      "**/.turbo",
      ".next",
      "**/.next",
      ".vite",
      "**/.vite",
      "node_modules/.cache",
      "**/node_modules/.cache",
      "node_modules/.vite",
      "**/node_modules/.vite",
    ],
  },
  {
    label: "log files",
    paths: ["*.log", "**/*.log", "logs", "**/logs"],
  },
  {
    label: "lock files",
    paths: ["pnpm-lock.yaml", "**/pnpm-lock.yaml"],
  },
];

const DESCRIPTION =
  "Cross-platform cleanup for build artifacts, caches, logs, and lock files.";

const SUPABASE_CLI_GUIDE_URL =
  "https://supabase.com/docs/guides/local-development/cli/getting-started";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

const colorEnabled =
  process.stdout.isTTY &&
  process.stderr.isTTY &&
  process.env.NO_COLOR === undefined;

function color(text: string, tone: keyof typeof ANSI): string {
  if (!colorEnabled) {
    return text;
  }

  return `${ANSI[tone]}${text}${ANSI.reset}`;
}

function title(text: string): void {
  const line = "=".repeat(72);
  console.log(color(line, "cyan"));
  console.log(`${color("CLEAN", "cyan")} ${color(text, "bold")}`);
  console.log(color(line, "cyan"));
}

function showHelp(): void {
  title("GDG PUP Platform Clean Command");
  console.log(`${color("Description:", "bold")} ${DESCRIPTION}`);
  console.log("");
  console.log(color("Usage:", "bold"));
  console.log("  pnpm clean");
  console.log("  pnpm clean --dry-run");
  console.log("  pnpm clean --install");
  console.log("  pnpm clean --build");
  console.log("  pnpm clean --gen-types");
  console.log("  pnpm clean --all");
  console.log("  pnpm clean --dry-run --all");
  console.log("  pnpm clean --description");
  console.log("  pnpm clean --help");
  console.log("");
  console.log(color("Options:", "bold"));
  console.log("  --dry-run       Show what would be removed without deleting");
  console.log("  --install       Run pnpm install after clean completes");
  console.log("  --build         Run pnpm build after clean completes");
  console.log(
    "  --gen-types     Run pnpm gen-types after clean (requires Supabase CLI login)",
  );
  console.log("  --all           Run install + gen-types + build after clean");
  console.log("  --description   Print a one-line command description");
  console.log("  -h, --help      Show this help message");
  console.log("");
  console.log(color("Cleanup Groups:", "bold"));
  for (const group of GROUPS) {
    console.log(`  - ${group.label}`);
  }
  console.log("");
  console.log(color("Supabase CLI Requirement (for --gen-types):", "bold"));
  console.log("  You must have Supabase CLI installed and logged in.");
  console.log(`  Guide: ${SUPABASE_CLI_GUIDE_URL}`);
  console.log("  Install examples:");
  console.log("    - macOS (Homebrew): brew install supabase/tap/supabase");
  console.log("    - Windows (Scoop):  scoop install supabase");
  console.log("    - Windows (NPM):    npm install -g supabase");
  console.log("    - Linux (NPM):      npm install -g supabase");
  console.log("  Login command: supabase login");
  console.log("");
}

function info(message: string): void {
  console.log(`${color("INFO", "cyan")} ${message}`);
}

function warn(message: string): void {
  console.warn(`${color("WARN", "yellow")} ${message}`);
}

function step(message: string): void {
  console.log(`${color("STEP", "gray")} ${message}`);
}

function ok(message: string): void {
  console.log(`${color("OK", "green")} ${message}`);
}

function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    const maybeCode = (error as { code?: unknown }).code;
    if (typeof maybeCode === "string") {
      return maybeCode;
    }
  }

  return undefined;
}

function isRetryableFsError(error: unknown): boolean {
  const code = getErrorCode(error);
  return code === "ENOTEMPTY" || code === "EBUSY" || code === "EPERM";
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function removeTargetWithRetry(target: string): Promise<void> {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await rimraf(target, { glob: true });
      return;
    } catch (error: unknown) {
      if (!isRetryableFsError(error) || attempt === maxAttempts) {
        throw error;
      }

      const delayMs = 120 * attempt;
      warn(
        `retrying delete for ${target} (attempt ${attempt}/${maxAttempts}) after ${delayMs}ms`,
      );
      await sleep(delayMs);
    }
  }
}

async function removePaths(paths: string[], dryRun: boolean): Promise<void> {
  for (const target of paths) {
    if (dryRun) {
      console.log(`  ${color("-", "gray")} would remove: ${target}`);
      continue;
    }

    await removeTargetWithRetry(target);
    console.log(`  ${color("-", "gray")} removed: ${target}`);
  }
}

function stopTurboDaemon(): void {
  const result = spawnSync("turbo", ["daemon", "stop"], {
    stdio: "pipe",
    encoding: "utf8",
  });

  if (result.error) {
    warn("Turbo daemon stop skipped (turbo not available in PATH).");
    return;
  }

  if (result.status !== 0) {
    info("Turbo daemon already stopped or not running.");
    return;
  }

  info("Turbo daemon stopped.");
}

function runPnpmTask(task: string, dryRun: boolean): void {
  if (dryRun) {
    info(`would run: pnpm ${task}`);
    return;
  }

  step(`running pnpm ${task}`);
  const result = spawnSync("pnpm", [task], { stdio: "inherit" });

  if (result.error) {
    throw new Error(`failed to execute pnpm ${task}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`pnpm ${task} exited with status ${result.status}`);
  }

  ok(`pnpm ${task} completed`);
}

function printSupabaseInstallGuide(): void {
  warn("Supabase CLI is required to run pnpm gen-types.");
  info(`Guide: ${SUPABASE_CLI_GUIDE_URL}`);
  console.log("  install (macOS): brew install supabase/tap/supabase");
  console.log("  install (Windows Scoop): scoop install supabase");
  console.log("  install (Windows/Linux NPM): npm install -g supabase");
}

function printSupabaseLoginGuide(): void {
  warn("Supabase CLI login is required to run pnpm gen-types.");
  console.log("  run: supabase login");
  console.log("  verify: supabase projects list");
}

function isSupabaseCliInstalled(): boolean {
  const result = spawnSync("supabase", ["--version"], {
    stdio: "pipe",
    encoding: "utf8",
  });

  return !result.error && result.status === 0;
}

function isSupabaseCliLoggedIn(): boolean {
  const result = spawnSync("supabase", ["projects", "list"], {
    stdio: "pipe",
    encoding: "utf8",
  });

  return !result.error && result.status === 0;
}

async function askYesNo(question: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = (await rl.question(`${question} (y/N): `))
      .trim()
      .toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

async function pauseBeforeBuildAfterGenTypesSkip(): Promise<void> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    warn(
      "gen-types was skipped due Supabase requirements; continuing to build in non-interactive mode.",
    );
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    warn("gen-types was skipped due Supabase requirements.");
    await rl.question(
      "Press Enter to continue with build, or Ctrl+C to cancel... ",
    );
  } finally {
    rl.close();
  }
}

async function shouldRunGenTypes(dryRun: boolean): Promise<boolean> {
  if (dryRun) {
    return true;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    warn("Non-interactive terminal detected. Skipping pnpm gen-types.");
    printSupabaseInstallGuide();
    printSupabaseLoginGuide();
    return false;
  }

  const hasCli = await askYesNo("Do you have Supabase CLI installed?");
  if (!hasCli) {
    printSupabaseInstallGuide();
    return false;
  }

  const isLoggedIn = await askYesNo("Are you logged in to Supabase CLI?");
  if (!isLoggedIn) {
    printSupabaseLoginGuide();
    return false;
  }

  if (!isSupabaseCliInstalled()) {
    warn("Supabase CLI was not detected in PATH. Skipping pnpm gen-types.");
    printSupabaseInstallGuide();
    return false;
  }

  if (!isSupabaseCliLoggedIn()) {
    warn(
      "Supabase CLI appears to be not logged in or inaccessible. Skipping pnpm gen-types.",
    );
    printSupabaseLoginGuide();
    return false;
  }

  return true;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  if (args.includes("--description")) {
    console.log(DESCRIPTION);
    return;
  }

  const dryRun = args.includes("--dry-run");
  const runAll = args.includes("--all");
  const runInstall = runAll || args.includes("--install");
  const runBuild = runAll || args.includes("--build");
  const runGenTypes = runAll || args.includes("--gen-types");

  if (runBuild && !runInstall) {
    throw new Error(
      "--build requires --install. Use --install --build or just --all.",
    );
  }

  title("Starting cleanup");
  info(DESCRIPTION);

  if (dryRun) {
    warn("dry-run mode enabled (no files will be deleted)");
  }

  step("stopping turbo daemon");
  stopTurboDaemon();
  await sleep(250);

  for (const group of GROUPS) {
    step(`cleaning ${group.label}`);
    await removePaths(group.paths, dryRun);
  }

  if (runInstall || runGenTypes || runBuild) {
    step("running requested post-clean tasks");
  }

  if (runInstall) {
    runPnpmTask("install", dryRun);
  }

  if (runGenTypes) {
    const canRunGenTypes = await shouldRunGenTypes(dryRun);
    if (canRunGenTypes) {
      runPnpmTask("gen-types", dryRun);
    } else if (runBuild && !dryRun) {
      await pauseBeforeBuildAfterGenTypesSkip();
    }
  }

  if (runBuild) {
    runPnpmTask("build", dryRun);
  }

  ok("clean complete");

  if (!runInstall) {
    info("next: run pnpm install to reinstall dependencies");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${color("ERROR", "red")} failed: ${message}`);
  process.exit(1);
});
