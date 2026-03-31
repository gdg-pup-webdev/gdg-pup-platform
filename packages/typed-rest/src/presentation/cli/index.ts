#!/usr/bin/env -S npx tsx
import crypto from "crypto";
import glob from "fast-glob";
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

const CACHE_FILE = path.resolve(ROOT_ABSOLUTE, ".build-cache");
function getSourceHash(): string {
  const files = glob.sync("**/*", {
    cwd: SRC_DIR_ABSOLUTE,
    absolute: true,
    ignore: ["**/node_modules/**"],
  });
  const hash = crypto.createHash("md5");

  // Sort files to ensure consistent hashing
  files.sort().forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      const content = fs.readFileSync(file);
      hash.update(file); // Include filename
      hash.update(content); // Include content
    }
  });

  return hash.digest("hex");
}

function isCacheValid(): boolean {
  if (!fs.existsSync(CACHE_FILE) || !fs.existsSync(DIST_DIR_ABSOLUTE))
    return false;
  const currentHash = getSourceHash();
  const savedHash = fs.readFileSync(CACHE_FILE, "utf-8");
  return currentHash === savedHash;
}

function updateCache() {
  const currentHash = getSourceHash();
  fs.writeFileSync(CACHE_FILE, currentHash);
}

// 1. Track the current child process and build state
let tscProcess: ChildProcess | null = null;
let isBuilding = false;
let buildQueued = false;

// Promisified spawn to prevent blocking the event loop
function runTypeScriptCompiler(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Added --incremental flag
    const child = spawn("npx", ["tsc", "-p", ROOT_ABSOLUTE], {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code, signal) => {
      tscProcess = null;
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
    updateCache();
  } catch (err) {
    logger.error("❌ Build failed:", err);
    process.exit(1);
  }
});

program
  .command("dev")
  .description("Watch src, generate contracts, and compile via tsc watch")
  .action(async () => {
    logger.log("🚀 Starting dev environment...");

    // 1. Run an initial contract generation
    if (isCacheValid()) {
      logger.log("🚀 Cache hit. Skipping initial build.");
    } else {
      logger.log("📦 Cache miss. Building...");
      await generateContract(
        SRC_DIR_ABSOLUTE,
        MODELS_DIRECTORY_RELATIVE,
        ROUTES_DIRECTORY_RELATIVE,
        OUTPUT_CONTRACT_DIR_ABSOLUTE,
        OUTPUT_CONTRACT_BASENAME,
      );
      updateCache();
    }

    // 2. Start tsc in native watch mode (keeps AST in memory)
    const tscWatchProcess = spawn(
      "npx",
      [
        "tsc",
        "-p",
        ROOT_ABSOLUTE,
        "--watch",
        "--preserveWatchOutput",
        "--incremental",
      ],
      {
        stdio: "inherit",
        shell: true,
      },
    );

    // 3. Only watch for files that should trigger a CONTRACT rebuild
    const debouncedContractGen = debounce(async () => {
      try {
        logger.log("Relevant change detected. Regenerating contract...");
        await generateContract(
          SRC_DIR_ABSOLUTE,
          MODELS_DIRECTORY_RELATIVE,
          ROUTES_DIRECTORY_RELATIVE,
          OUTPUT_CONTRACT_DIR_ABSOLUTE,
          OUTPUT_CONTRACT_BASENAME,
        );
        updateCache();
        // We DO NOT kill tsc here. tsc --watch will automatically detect
        // the newly generated contract file and recompile it instantly.
      } catch (err) {
        logger.error("❌ Contract generation failed:", err);
      }
    }, 500);

    const contractFilepath = path.join(
      OUTPUT_CONTRACT_DIR_ABSOLUTE,
      OUTPUT_CONTRACT_BASENAME,
    );

    chokidar
      .watch(SRC_DIR_ABSOLUTE, {
        ignoreInitial: true,
        // Ignore the contract file itself so generating it doesn't trigger an infinite loop
        ignored: [contractFilepath, "**/node_modules/**", "**/.git/**"],
      })
      .on("all", (event, filepath) => {
        // You might want to filter here so it ONLY triggers on route/model changes
        debouncedContractGen();
      });
  });

program.parse(process.argv);
