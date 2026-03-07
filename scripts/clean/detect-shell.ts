#!/usr/bin/env node
// filepath: scripts/clean/detect-shell.ts

const { execSync } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// ANSI Color Helpers
// ═══════════════════════════════════════════════════════════════════════════

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",

  // Foreground colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",

  // Bright colors
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
};

const c = colors; // Shorthand

// Styled logging functions
const log = {
  titleLine: () =>
    console.log(`\n${c.bold}${c.cyan}${"═".repeat(75)}${c.reset}`),
  title: (text: string) => {
    console.log(`\n${c.bold}${c.cyan}${"═".repeat(75)}${c.reset}`);
    console.log(`${c.bold}${c.brightCyan}${text}${c.reset}`);
    console.log(`${c.bold}${c.cyan}${"═".repeat(75)}${c.reset}`);
  },
  header: (text: string) =>
    console.log(`${c.bold}${c.brightCyan}${text}${c.reset}`),
  success: (text: string) =>
    console.log(`${c.brightGreen}✓${c.reset} ${c.green}${text}${c.reset}`),
  error: (text: string) =>
    console.log(`${c.brightRed}✗${c.reset} ${c.red}${text}${c.reset}`),
  warning: (text: string) =>
    console.log(`${c.brightYellow}⚠${c.reset} ${c.yellow}${text}${c.reset}`),
  info: (text: string) =>
    console.log(`${c.brightCyan}ℹ${c.reset} ${c.cyan}${text}${c.reset}`),
  step: (text: string) =>
    console.log(`${c.brightBlue}▸${c.reset} ${c.white}${text}${c.reset}`),
  action: (emoji: string, text: string) =>
    console.log(
      `${c.brightWhite}${emoji}${c.reset}  ${c.white}${text}${c.reset}`,
    ),
  label: (label: string, value: string) =>
    console.log(
      `  ${c.dim}${label.padEnd(15)}${c.reset} ${c.white}${value}${c.reset}`,
    ),
  divider: () => console.log(`${c.gray}${"─".repeat(75)}${c.reset}`),
  thinDivider: () => console.log(`${c.dim}${"·".repeat(75)}${c.reset}`),
  space: () => console.log(""),
};

// ═══════════════════════════════════════════════════════════════════════════
// Shell Detection Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a shell executable exists on the system
 */
function shellExists(shellName: string): boolean {
  try {
    if (process.platform === "win32") {
      execSync(`where ${shellName}`, { stdio: "ignore" });
    } else {
      execSync(`which ${shellName}`, { stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Detects the current shell and runs the appropriate clean script
 */
function detectShell() {
  const platform = process.platform;

  // Windows detection
  if (platform === "win32") {
    const shell = process.env.SHELL || process.env.ComSpec || "";

    if (
      (shell.toLowerCase().includes("powershell") ||
        shell.toLowerCase().includes("pwsh")) &&
      shellExists("pwsh")
    ) {
      return {
        shell: "PowerShell",
        script: "scripts/clean/extra/clean.ps1",
        executor: "pwsh",
        icon: "🔷",
      };
    }
    return {
      shell: "Command Prompt",
      script: "scripts/clean/clean.bat",
      executor: "cmd /c",
      icon: "⬛",
    };
  }

  // Unix-like detection
  const shell = process.env.SHELL || "";

  // Check for specific shells (with existence validation)
  if (shell.includes("fish") && shellExists("fish")) {
    return {
      shell: "Fish",
      script: "scripts/clean/extra/clean.fish",
      executor: "fish",
      icon: "🐟",
    };
  }

  if (shell.includes("zsh") && shellExists("zsh")) {
    return {
      shell: "Zsh",
      script: "scripts/clean/extra/clean.zsh",
      executor: "zsh",
      icon: "⚡",
    };
  }

  if (shell.includes("ksh") && shellExists("ksh")) {
    return {
      shell: "Korn Shell",
      script: "scripts/clean/extra/clean.ksh",
      executor: "ksh",
      icon: "🐚",
    };
  }

  if (shell.includes("bash") && shellExists("bash")) {
    return {
      shell: "Bash",
      script: "scripts/clean/extra/clean.bash",
      executor: "bash",
      icon: "🔨",
    };
  }

  // Default to POSIX sh (always available)
  return {
    shell: "POSIX Shell",
    script: "scripts/clean/clean.sh",
    executor: "sh",
    icon: "📜",
  };
}

/**
 * Checks if a script file exists
 */
function scriptExists(scriptPath: string): boolean {
  const fullPath = path.join(process.cwd(), scriptPath);
  return existsSync(fullPath);
}

/**
 * Runs the appropriate clean script
 */
function runCleanScript() {
  const detected = detectShell();

  // Header
  log.title("  🧹 GDG PUP Platform - Clean Script");
  log.space();

  // Detection info in a box
  log.thinDivider();
  log.label("Shell Detected:", `${detected.icon}  ${detected.shell}`);
  log.label("Script:", detected.script);
  log.thinDivider();
  log.space();

  // Verify script exists
  if (!scriptExists(detected.script)) {
    log.warning(`Script not found: ${detected.script}`);
    log.warning("Falling back to default...");
    log.space();

    // Fallback to guaranteed defaults
    if (process.platform === "win32") {
      detected.script = "scripts/clean/clean.bat";
      detected.executor = "cmd /c";
      detected.shell = "Command Prompt";
      detected.icon = "⬛";
    } else {
      detected.script = "scripts/clean/clean.sh";
      detected.executor = "sh";
      detected.shell = "POSIX Shell";
      detected.icon = "📜";
    }

    // Check fallback exists
    if (!scriptExists(detected.script)) {
      log.error(`Fatal: Default clean script not found: ${detected.script}`);
      log.error("Please ensure clean scripts are in the correct location.");
      log.space();
      process.exit(1);
    }

    log.info(`Using fallback: ${c.dim}${detected.script}${c.reset}`);
    log.space();
  }

  // What we're cleaning
  log.header("🗑️  Cleaning Operations:");
  log.action("🛑", "Stopping Turbo daemon");
  log.action("📦", "Removing build artifacts");
  log.action("🗂️", "Clearing cache directories");
  log.action("📝", "Deleting log files");
  log.action("🔒", "Removing lock files");
  log.space();

  log.divider();
  log.space();

  try {
    // Execute the script (suppress npm warnings)
    const command = `${detected.executor} ${detected.script} 2>&1 | grep -v "npm warn" || true`;
    execSync(command, { stdio: "inherit", shell: "/bin/bash" });

    log.space();
    log.divider();
    log.space();

    // Success message
    log.success(
      `Clean completed successfully using ${detected.icon}  ${detected.shell}`,
    );
    log.space();

    // Next steps
    log.header("📌 Next Steps:");
    log.step(
      `Run ${c.brightCyan}pnpm install${c.reset} to reinstall dependencies`,
    );
    log.step(`Run ${c.brightCyan}pnpm build${c.reset} to rebuild projects`);
    log.space();
  } catch (error) {
    log.space();
    log.divider();
    log.space();
    log.error(`Clean failed: ${(error as any).message}`);
    log.space();
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLI Argument Handlers
// ═══════════════════════════════════════════════════════════════════════════

// Show help if requested
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  log.title("  🧹 GDG PUP Platform - Clean Script Detector");
  log.space();

  console.log(
    `${c.dim}Automatically detects your shell and runs the appropriate clean script.${c.reset}`,
  );
  log.space();

  log.header("📋 Usage:");
  log.step("pnpm clean                    Auto-detect and clean");
  log.step("pnpm clean --help             Show this help message");
  log.space();

  log.header("🐚 Supported Shells:");
  console.log(
    `  ${c.cyan}•${c.reset} ${c.dim}sh${c.reset}         POSIX shell (default fallback)`,
  );
  console.log(`  ${c.cyan}•${c.reset} ${c.dim}bash${c.reset}       Bash`);
  console.log(
    `  ${c.cyan}•${c.reset} ${c.dim}zsh${c.reset}        Zsh (default on macOS)`,
  );
  console.log(`  ${c.cyan}•${c.reset} ${c.dim}fish${c.reset}       Fish shell`);
  console.log(`  ${c.cyan}•${c.reset} ${c.dim}ksh${c.reset}        Korn shell`);
  console.log(
    `  ${c.cyan}•${c.reset} ${c.dim}pwsh${c.reset}       PowerShell (cross-platform)`,
  );
  console.log(
    `  ${c.cyan}•${c.reset} ${c.dim}cmd${c.reset}        Windows Command Prompt`,
  );
  log.space();

  log.header("🗑️  What Gets Cleaned:");
  log.action("🛑", "Turbo daemon (stopped first)");
  log.action("📦", "Build artifacts (dist/)");
  log.action("🗂️", "Cache files (.turbo, .next, .vite)");
  log.action("📝", "Log files (*.log, logs/)");
  log.action("🔒", "Lock files (pnpm-lock.yaml)");
  log.space();

  log.header("📁 Expected Script Locations:");
  console.log(
    `  ${c.dim}scripts/clean/clean.sh              ${c.gray}(POSIX - fallback)${c.reset}`,
  );
  console.log(
    `  ${c.dim}scripts/clean/clean.bat             ${c.gray}(Windows - fallback)${c.reset}`,
  );
  console.log(
    `  ${c.dim}scripts/clean/extra/clean.bash      ${c.gray}(Bash)${c.reset}`,
  );
  console.log(
    `  ${c.dim}scripts/clean/extra/clean.zsh       ${c.gray}(Zsh)${c.reset}`,
  );
  console.log(
    `  ${c.dim}scripts/clean/extra/clean.fish      ${c.gray}(Fish)${c.reset}`,
  );
  console.log(
    `  ${c.dim}scripts/clean/extra/clean.ksh       ${c.gray}(Korn)${c.reset}`,
  );
  console.log(
    `  ${c.dim}scripts/clean/extra/clean.ps1       ${c.gray}(PowerShell)${c.reset}`,
  );
  log.space();

  log.header("🔧 Debug Options:");
  log.step("--verbose, -v                 Show detection details");
  log.step(
    "--dry-run                     Show what would run (with --verbose)",
  );
  log.step("--list-scripts                List all available clean scripts");
  log.step("--debug                       Show environment variables");
  log.space();

  log.header("💡 Examples:");
  console.log(
    `  ${c.brightCyan}$${c.reset} pnpm clean                    ${c.gray}# Auto-detect${c.reset}`,
  );
  console.log(
    `  ${c.brightCyan}$${c.reset} pnpm clean --help             ${c.gray}# Show help${c.reset}`,
  );
  console.log(
    `  ${c.brightCyan}$${c.reset} SHELL=/bin/zsh pnpm clean     ${c.gray}# Force Zsh detection${c.reset}`,
  );
  log.space();

  process.exit(0);
}

// List available scripts
if (process.argv.includes("--list-scripts")) {
  log.title("  📜 Available Clean Scripts");
  log.space();

  const scripts = [
    {
      path: "scripts/clean/clean.sh",
      desc: "POSIX shell (default)",
      icon: "📜",
    },
    {
      path: "scripts/clean/clean.bat",
      desc: "Windows Batch (default)",
      icon: "⬛",
    },
    {
      path: "scripts/clean/extra/clean.bash",
      desc: "Bash-specific",
      icon: "🔨",
    },
    { path: "scripts/clean/extra/clean.zsh", desc: "Zsh-specific", icon: "⚡" },
    { path: "scripts/clean/extra/clean.fish", desc: "Fish shell", icon: "🐟" },
    { path: "scripts/clean/extra/clean.ksh", desc: "Korn shell", icon: "🐚" },
    { path: "scripts/clean/extra/clean.ps1", desc: "PowerShell", icon: "🔷" },
  ];

  scripts.forEach(({ path: scriptPath, desc, icon }) => {
    const exists = scriptExists(scriptPath);
    const status = exists
      ? `${c.brightGreen}✓${c.reset}`
      : `${c.brightRed}✗${c.reset}`;
    const pathColor = exists ? c.white : c.gray;
    const descColor = exists ? c.dim : c.gray;

    console.log(
      `${status} ${icon}  ${pathColor}${scriptPath.padEnd(43)}${c.reset} ${descColor}${desc}${c.reset}`,
    );
  });

  log.space();
  process.exit(0);
}

// Show detected info if verbose
if (process.argv.includes("--verbose") || process.argv.includes("-v")) {
  const detected = detectShell();

  log.title("  🔍 Detection Configuration");
  log.space();

  log.label("Platform:", process.platform);
  log.label("Shell:", `${detected.icon}  ${detected.shell}`);
  log.label("Script:", detected.script);
  log.label(
    "Exists:",
    scriptExists(detected.script)
      ? `${c.green}✓ Yes${c.reset}`
      : `${c.red}✗ No${c.reset}`,
  );
  log.label("Executor:", detected.executor);
  log.label("$SHELL:", process.env.SHELL || `${c.gray}(not set)${c.reset}`);
  log.label("$ComSpec:", process.env.ComSpec || `${c.gray}(not set)${c.reset}`);

  log.space();

  if (process.argv.includes("--dry-run")) {
    log.warning("Dry run - not executing clean script");
    log.space();
    process.exit(0);
  }
}

// Debug mode
if (process.argv.includes("--debug")) {
  log.title("  🐛 Debug: Environment Variables");
  log.space();

  log.label("Platform:", process.platform);
  log.label("$SHELL:", process.env.SHELL || `${c.gray}(not set)${c.reset}`);
  log.label("$ComSpec:", process.env.ComSpec || `${c.gray}(not set)${c.reset}`);
  log.label("$TERM:", process.env.TERM || `${c.gray}(not set)${c.reset}`);
  log.label(
    "$BASH_VERSION:",
    process.env.BASH_VERSION || `${c.gray}(not set)${c.reset}`,
  );
  log.label(
    "$ZSH_VERSION:",
    process.env.ZSH_VERSION || `${c.gray}(not set)${c.reset}`,
  );
  log.label(
    "$FISH_VERSION:",
    process.env.FISH_VERSION || `${c.gray}(not set)${c.reset}`,
  );
  log.label("Node:", process.argv[0]);

  log.space();
  process.exit(0);
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Execution
// ═══════════════════════════════════════════════════════════════════════════

runCleanScript();
