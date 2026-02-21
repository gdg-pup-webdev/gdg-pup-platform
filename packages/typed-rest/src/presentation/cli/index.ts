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

const program = new Command();

const ROOT_ABSOLUTE = process.cwd();
const SRC_DIR_ABSOLUTE = path.resolve(ROOT_ABSOLUTE, "./src");
const DIST_DIR_ABSOLUTE = path.resolve(ROOT_ABSOLUTE, "./dist");

const MODELS_DIRECTORY_RELATIVE = "./models";
const ROUTES_DIRECTORY_RELATIVE = "./routes";
const OUTPUT_CONTRACT_DIR_ABSOLUTE = SRC_DIR_ABSOLUTE;
const OUTPUT_CONTRACT_BASENAME = `./${configs.appName}.contract.ts`;

async function syncAndGenerate() {
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
  try {
    execSync(`npx tsc -p "${ROOT_ABSOLUTE}"`, { stdio: "inherit" });
    logger.log("✅ Final build ready in dist/build");
  } catch (tscError) {
    logger.error(
      "❌ TypeScript compilation failed. Fix the errors to continue.",
    );
  }
}

program.command("build").action(async () => {
  try {
    if (!fs.existsSync(DIST_DIR_ABSOLUTE)) {
      fs.mkdirSync(DIST_DIR_ABSOLUTE, { recursive: true });
    }

    if (fs.existsSync(DIST_DIR_ABSOLUTE)) {
      fs.rmSync(DIST_DIR_ABSOLUTE, { recursive: true, force: true });
    }

    if (!fs.existsSync(DIST_DIR_ABSOLUTE)) {
      fs.mkdirSync(DIST_DIR_ABSOLUTE, { recursive: true });
    }

    await syncAndGenerate();

    logger.log("✅ Final build ready in dist/build");
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
        await syncAndGenerate().catch((e) => logger.error("Sync failed:", e));
      } catch (err) {
        logger.error("❌ Generation failed during watch:", err);
        if (err instanceof Error) logger.error("stack: ", err.stack);
      }
    }, 300);
    const contractFilepath = path.join(
      OUTPUT_CONTRACT_DIR_ABSOLUTE,
      OUTPUT_CONTRACT_BASENAME,
    );

    chokidar
      .watch(SRC_DIR_ABSOLUTE, {
        ignoreInitial: true,
        ignored: [contractFilepath, "**/node_modules/**", "**/.git/**"],
      })
      .on("all", (event, path) => {
        logger.log(`File ${event}: ${path}`);
        debouncedSync();
      });
  });

program.parse(process.argv);
