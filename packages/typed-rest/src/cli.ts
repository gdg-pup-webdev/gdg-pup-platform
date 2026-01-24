#!/usr/bin/env -S npx tsx

import { Command } from "commander";
import path from "path";
import chokidar from "chokidar";
import { debounce } from "./utils/utils.js";
import { logger } from "#utils/logging.utils.js";
import { generate } from "#main/generate.js";

const program = new Command();
program
  .name("contract-gen")
  .description(
    "Generates a single Zod contract object from a file-based API structure",
  )
  .option("-w, --watch", "Watch for file changes and regenerate")
  .parse(process.argv);

const options = program.opts();
export const MODEL_DIR = path.resolve(process.cwd(), "./src/models");
export const SRC_DIR = path.resolve(process.cwd(), "./src/routes");
export const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "./src/typedrest.contract.ts",
);

async function run() {
  try {
    // Always run once immediately
    logger.clear();
    await generate(MODEL_DIR, SRC_DIR, OUTPUT_FILE);

    if (options.watch) {
      logger.log("Watching for changes in routes and models...");
      const debouncedGenerate = debounce(async () => {
        logger.log("Change detected. Regenerating...");
        try {
          await generate(MODEL_DIR, SRC_DIR, OUTPUT_FILE);
        } catch (err) {
          logger.error("❌ Generation failed during watch:", err);
        }
      }, 200);

      // Watch both Routes and Models directories
      const watcher = chokidar.watch([SRC_DIR, MODEL_DIR], {
        ignored: /(^|\/|\\)\..*/, // ignore dotfiles
        persistent: true,
        ignoreInitial: true,
      });

      watcher
        .on("add", debouncedGenerate)
        .on("change", debouncedGenerate)
        .on("unlink", debouncedGenerate);

      // Keep process alive
    } else {
      process.exit(0);
    }
  } catch (err) {
    logger.error("❌ Generation failed:", err);
    process.exit(1);
  }
}

run();
