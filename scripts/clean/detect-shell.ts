#!/usr/bin/env node
// filepath: scripts/clean/detect-shell.ts
// Ignore the type errors

const { execSync } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

/**
 * Detects the current shell and runs the appropriate clean script
 */
function detectShell() {
  const platform = process.platform;

  // Windows detection
  if (platform === "win32") {
    const shell = process.env.SHELL || process.env.ComSpec || "";

    if (
      shell.toLowerCase().includes("powershell") ||
      shell.toLowerCase().includes("pwsh")
    ) {
      return {
        shell: "powershell",
        script: "scripts/clean/extra/clean.ps1",
        executor: "pwsh",
      };
    }
    return {
      shell: "cmd",
      script: "scripts/clean/clean.bat",
      executor: "cmd /c",
    };
  }

  // Unix-like detection
  const shell = process.env.SHELL || "";

  // Check for specific shells
  if (shell.includes("fish")) {
    return {
      shell: "fish",
      script: "scripts/clean/extra/clean.fish",
      executor: "fish",
    };
  }

  if (shell.includes("zsh")) {
    return {
      shell: "zsh",
      script: "scripts/clean/extra/clean.zsh",
      executor: "zsh",
    };
  }

  if (shell.includes("ksh")) {
    return {
      shell: "ksh",
      script: "scripts/clean/extra/clean.ksh",
      executor: "ksh",
    };
  }

  if (shell.includes("bash")) {
    return {
      shell: "bash",
      script: "scripts/clean/extra/clean.bash",
      executor: "bash",
    };
  }

  // Default to POSIX sh
  return { shell: "sh", script: "scripts/clean/clean.sh", executor: "sh" };
}

/**
 * Checks if a script file exists
 */
function scriptExists(scriptPath: string) {
  const fullPath = path.join(process.cwd(), scriptPath);
  return existsSync(fullPath);
}

/**
 * Runs the appropriate clean script
 */
function runCleanScript() {
  const detected = detectShell();

  console.log(`\x1b[36m🔍 Detected shell: ${detected.shell}\x1b[0m`);
  console.log(`\x1b[36m📜 Using script: ${detected.script}\x1b[0m\n`);

  // Fallback check
  if (!scriptExists(detected.script)) {
    console.log(
      `\x1b[33m⚠️  Specific script not found, falling back to default\x1b[0m\n`,
    );

    if (process.platform === "win32") {
      detected.script = "scripts/clean/clean.bat";
      detected.executor = "cmd /c";
    } else {
      detected.script = "scripts/clean/clean.sh";
      detected.executor = "sh";
    }
  }

  try {
    // Execute the script
    const command = `${detected.executor} ${detected.script}`;
    execSync(command, { stdio: "inherit" });

    console.log(
      `\n\x1b[32m✅ Clean completed successfully using ${detected.shell}\x1b[0m`,
    );
  } catch (error) {
    console.error(
      `\n\x1b[31m❌ Clean failed: ${(error as any).message}\x1b[0m`,
    );
    process.exit(1);
  }
}

// Show help if requested
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
\x1b[1mGDG PUP Platform - Clean Script Detector\x1b[0m

Automatically detects your shell and runs the appropriate clean script.

\x1b[33mUsage:\x1b[0m
  pnpm clean                    Auto-detect and clean
  pnpm clean:help               Show this help message

\x1b[33mSupported Shells:\x1b[0m
  - sh         POSIX shell (default fallback)
  - bash       Bash
  - zsh        Zsh (default on macOS)
  - fish       Fish shell
  - ksh        Korn shell
  - pwsh       PowerShell (cross-platform)
  - cmd        Windows Command Prompt

\x1b[33mWhat Gets Cleaned:\x1b[0m
  ✅ Turbo daemon (stopped first)
  ✅ Build artifacts (dist/)
  ✅ Cache files (.turbo, .next, .vite)
  ✅ Node cache (node_modules/.cache)
  ✅ Log files (*.log, logs/)
  ✅ Lock files (pnpm-lock.yaml)

\x1b[33mEnvironment Variables:\x1b[0m
  SHELL        Current shell path (Unix/Linux/macOS)
  ComSpec      Command processor (Windows)

\x1b[33mExamples:\x1b[0m
  pnpm clean                    # Auto-detect and clean
  pnpm clean:help               # Show help
  SHELL=/bin/zsh pnpm clean     # Force Zsh detection

\x1b[33mAfter Cleaning:\x1b[0m
  pnpm install                  # Reinstall dependencies
  pnpm build                    # Rebuild projects

\x1b[33mDebug Options:\x1b[0m
  --verbose, -v                 Show detection details
  --dry-run                     Show what would run (with --verbose)
`);
  process.exit(0);
}

// Show detected info if verbose
if (process.argv.includes("--verbose") || process.argv.includes("-v")) {
  const detected = detectShell();
  console.log("\n\x1b[1mDetected Configuration:\x1b[0m");
  console.log("─────────────────────────");
  console.log(`Platform:    ${process.platform}`);
  console.log(`Shell:       ${detected.shell}`);
  console.log(`Script:      ${detected.script}`);
  console.log(`Executor:    ${detected.executor}`);
  console.log(`$SHELL:      ${process.env.SHELL || "not set"}`);
  console.log(`$ComSpec:    ${process.env.ComSpec || "not set"}`);
  console.log("─────────────────────────\n");

  if (process.argv.includes("--dry-run")) {
    console.log("\x1b[33m🏃 Dry run - not executing clean script\x1b[0m\n");
    process.exit(0);
  }
}

// Run the clean script
runCleanScript();
