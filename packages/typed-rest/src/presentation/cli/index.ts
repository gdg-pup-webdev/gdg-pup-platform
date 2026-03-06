#!/usr/bin/env -S npx tsx

import { Command } from "commander";
import path from "path";
import chokidar from "chokidar";
import { execSync } from "child_process";
import fs from "fs";
import { logger } from "#utils/logger.utils.js";
import { generateContract } from "#application/index.js";
import { debounce } from "#utils/core.utils.js";
import { configs } from "#configs/configs.js";
import { spawn, ChildProcess } from "child_process";

const program = new Command();

const ROOT_ABSOLUTE = process.cwd();
const SRC_DIR_ABSOLUTE = path.resolve(ROOT_ABSOLUTE, "./src");
const DIST_DIR_ABSOLUTE = path.resolve(ROOT_ABSOLUTE, "./dist");

const MODELS_DIRECTORY_RELATIVE = "./models";
const ROUTES_DIRECTORY_RELATIVE = "./routes";
const OUTPUT_CONTRACT_DIR_ABSOLUTE = SRC_DIR_ABSOLUTE;
const OUTPUT_CONTRACT_BASENAME = `./${configs.appName}.contract.ts`;

// 1. Track the current child process and build state
let tscProcess: ChildProcess | null = null;
let isBuilding = false;
let buildQueued = false;

// Promisified spawn to prevent blocking the event loop
function runTypeScriptCompiler(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Using npx to safely locate the hoisted tsc binary in the monorepo
    const child = spawn("npx", ["tsc", "-p", ROOT_ABSOLUTE], {
      stdio: "inherit",
      shell: true, // Crucial: required for npx to execute properly, especially on Windows
    });

    child.on("close", (code, signal) => {
      tscProcess = null;
      // If we manually killed the process, signal will exist.
      // We treat a kill signal as a safe exit so it doesn't crash the script.
      if (code === 0 || signal) {
        resolve();
      } else {
        reject(new Error(`TypeScript compilation failed with code ${code}`));
      }
    });
  });
}

async function syncAndGenerate(isWatchMode = false) {
  // 2. Prevent overlapping builds
  if (isBuilding) {
    buildQueued = true;
    return;
  }

  isBuilding = true;

  try {
    logger.log("Syncing source and generating contract...");

    if (!fs.existsSync(DIST_DIR_ABSOLUTE)) {
      fs.mkdirSync(DIST_DIR_ABSOLUTE, { recursive: true });
    }

    await generateContract(
      SRC_DIR_ABSOLUTE,
      MODELS_DIRECTORY_RELATIVE,
      ROUTES_DIRECTORY_RELATIVE,
      OUTPUT_CONTRACT_DIR_ABSOLUTE,
      OUTPUT_CONTRACT_BASENAME,
    );

    logger.log("Compiling...");
    await runTypeScriptCompiler();
    // Only log success if it wasn't interrupted by a new queued build
    if (!buildQueued) {
      logger.log("✅ Final build ready in dist/build");
    }
  } catch (error) {
    logger.error("❌ Generation/Compilation failed.");
    // If we are doing a production build, we MUST throw the error so the process exits with 1
    if (!isWatchMode) {
      throw error;
    }
  } finally {
    isBuilding = false;
    // If a change happened while building, run it again now
    if (buildQueued) {
      buildQueued = false;
      await syncAndGenerate(isWatchMode);
    }
  }
}

program.command("build").action(async () => {
  try {
    // Simplified folder cleanup
    if (fs.existsSync(DIST_DIR_ABSOLUTE)) {
      fs.rmSync(DIST_DIR_ABSOLUTE, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_DIR_ABSOLUTE, { recursive: true });

    await syncAndGenerate();
  } catch (err) {
    logger.error("❌ Build failed:", err);
    process.exit(1);
  }
});

program
  .command("dev")
  .description("Watch src, sync to dist, and compile")
  .action(async () => {
    await syncAndGenerate();

    const debouncedSync = debounce(async () => {
      try {
        logger.log("Change detected. Regenerating...");
        await syncAndGenerate(true);
      } catch (err) {
        logger.error("❌ Generation failed during watch:", err);
        if (err instanceof Error) logger.error("stack: ", err.stack);
      }
    }, 500);

    const contractFilepath = path.join(
      OUTPUT_CONTRACT_DIR_ABSOLUTE,
      OUTPUT_CONTRACT_BASENAME,
    );

    chokidar
      .watch(SRC_DIR_ABSOLUTE, {
        ignoreInitial: true,
        ignored: [contractFilepath, "**/node_modules/**", "**/.git/**"],
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100,
        },
      })
      .on("all", (event, path) => {
        logger.log(`File ${event}: ${path}`);

        // IMMEDIATE ACTION: Kill the compiler to release file locks instantly
        if (tscProcess) {
          tscProcess.kill();
        }

        debouncedSync();
      });
  });

program.parse(process.argv);
