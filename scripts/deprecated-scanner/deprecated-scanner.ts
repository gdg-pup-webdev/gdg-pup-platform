import { promises as fs } from "node:fs";
import path from "node:path";

type Finding = {
  filePath: string;
  fileName: string;
  line: number;
  reason: "@deprecated" | "_DEPRECATED";
  lineText: string;
};

type IgnoreConfig = {
  patterns: string[];
};

type CliArgs = {
  rootDir: string;
  reportPath: string;
  ignoreConfigPath: string;
};

const DEFAULT_REPORT_PATH = "logs/deprecated-scanner/deprecated-report.md";
const DEFAULT_IGNORE_CONFIG_PATH =
  "scripts/deprecated-scanner/deprecated-scanner-ignore.json";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
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

function paint(text: string, color: keyof typeof ANSI): string {
  if (!colorEnabled) {
    return text;
  }

  return `${ANSI[color]}${text}${ANSI.reset}`;
}

function paintBold(text: string): string {
  if (!colorEnabled) {
    return text;
  }

  return `${ANSI.bold}${text}${ANSI.reset}`;
}

function nowTimestamp(): string {
  return new Date().toISOString();
}

function logInfo(message: string): void {
  console.log(`${paint("INFO", "cyan")} ${message}`);
}

function logStep(message: string): void {
  console.log(`${paint("STEP", "yellow")} ${message}`);
}

function logSuccess(message: string): void {
  console.log(`${paint("OK", "green")} ${message}`);
}

function logError(message: string): void {
  console.error(`${paint("ERROR", "red")} ${message}`);
}

function logBanner(): void {
  const line = "=".repeat(72);
  console.log(paintBold(line));
  console.log(paintBold("DEPRECATED CODE SCANNER"));
  console.log(`${paint("Time", "gray")}: ${nowTimestamp()}`);
  console.log(paintBold(line));
}

function formatDurationMs(durationMs: number): string {
  if (durationMs < 1000) {
    return `${durationMs} ms`;
  }

  return `${(durationMs / 1000).toFixed(2)} s`;
}

function printUsage(): void {
  const usage = [
    paintBold("Deprecated Scanner CLI"),
    "",
    paintBold("Usage"),
    "  scan:dep <root_dir> [report_path] [ignore_config_path]",
    "",
    paintBold("Arguments"),
    "  root_dir             Directory to scan recursively (relative or absolute)",
    `  report_path          Optional. Defaults to ${DEFAULT_REPORT_PATH}`,
    `  ignore_config_path   Optional. Defaults to ${DEFAULT_IGNORE_CONFIG_PATH}`,
    "",
    paintBold("Output Format"),
    "  Supports .md, .txt, and .ndjson based on report_path extension.",
    "  Default is .md for human-readable table output.",
    "",
    paintBold("Options"),
    "  -h, --help           Show this help message",
    "",
    paintBold("Ignore Config JSON"),
    "  Directory patterns ending in / match anywhere under root_dir.",
    "  Prefix a directory pattern with / to match only from root_dir.",
    "  {",
    '    "patterns": ["dist/", "node_modules/", "/logs/", "*.map"]',
    "  }",
    "",
    paintBold("Examples"),
    "  pnpm scan:dep ./apps",
    "  pnpm scan:dep ./apps ./logs/deprecated-scanner/custom-report.md",
    "  pnpm scan:dep ./apps ./logs/deprecated-scanner/custom-report.txt",
    "  pnpm scan:dep ./apps ./logs/deprecated-scanner/custom-report.ndjson",
    "  pnpm scan:dep ./apps ./logs/deprecated-scanner/custom-report.md ./scripts/deprecated-scanner/deprecated-scanner-ignore.json",
  ].join("\n");

  console.log(usage);
}

function parseCliArgs(argv: string[]): CliArgs {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  if (argv.length < 1 || argv.length > 3) {
    printUsage();
    throw new Error("Expected 1 to 3 parameters.");
  }

  const [rootDir, reportPath, ignoreConfigPath] = argv;

  return {
    rootDir,
    reportPath: reportPath ?? DEFAULT_REPORT_PATH,
    ignoreConfigPath: ignoreConfigPath ?? DEFAULT_IGNORE_CONFIG_PATH,
  };
}

function toPosixPath(inputPath: string): string {
  return inputPath.split(path.sep).join("/");
}

function escapeRegExp(source: string): string {
  return source.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function patternToRegExp(pattern: string): RegExp {
  const normalizedPattern = toPosixPath(pattern.trim());
  const escaped = escapeRegExp(normalizedPattern)
    .replace(/\*\*/g, "__DOUBLE_STAR__")
    .replace(/\*/g, "[^/]*")
    .replace(/__DOUBLE_STAR__/g, ".*");

  return new RegExp(`^${escaped}$`);
}

function matchesDirectoryPattern(
  normalizedPath: string,
  directoryPattern: string,
  rootAnchored: boolean,
): boolean {
  if (rootAnchored) {
    return (
      normalizedPath === directoryPattern ||
      normalizedPath.startsWith(`${directoryPattern}/`)
    );
  }

  return (
    normalizedPath === directoryPattern ||
    normalizedPath.startsWith(`${directoryPattern}/`) ||
    normalizedPath.endsWith(`/${directoryPattern}`) ||
    normalizedPath.includes(`/${directoryPattern}/`)
  );
}

function normalizeIgnoreConfig(value: unknown): IgnoreConfig {
  if (!value || typeof value !== "object") {
    throw new Error("Ignore config must be a JSON object.");
  }

  const config = value as { patterns?: unknown };
  if (!Array.isArray(config.patterns)) {
    throw new Error(
      'Ignore config must contain a string array field named "patterns".',
    );
  }

  const patterns = config.patterns
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .filter((entry) => !entry.startsWith("#"));

  return { patterns };
}

async function readIgnorePatternsFromJson(
  ignoreConfigPath: string,
): Promise<string[]> {
  const raw = await fs.readFile(ignoreConfigPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const config = normalizeIgnoreConfig(parsed);
  return config.patterns;
}

function isIgnored(
  relativePath: string,
  ignorePatterns: string[],
  isDirectory: boolean,
): boolean {
  const normalized = toPosixPath(relativePath);

  for (const pattern of ignorePatterns) {
    const normalizedPattern = toPosixPath(pattern);

    if (normalizedPattern.endsWith("/")) {
      const patternWithoutTrailingSlash = normalizedPattern.slice(0, -1);
      const rootAnchored = patternWithoutTrailingSlash.startsWith("/");
      const dirPattern = rootAnchored
        ? patternWithoutTrailingSlash.slice(1)
        : patternWithoutTrailingSlash;

      if (
        dirPattern.length > 0 &&
        matchesDirectoryPattern(normalized, dirPattern, rootAnchored)
      ) {
        return true;
      }
      continue;
    }

    if (!normalizedPattern.includes("/")) {
      const basename = path.posix.basename(normalized);
      if (patternToRegExp(normalizedPattern).test(basename)) {
        return true;
      }
    }

    if (patternToRegExp(normalizedPattern).test(normalized)) {
      return true;
    }

    if (isDirectory && normalized.startsWith(`${normalizedPattern}/`)) {
      return true;
    }
  }

  return false;
}

function detectReason(line: string): Finding["reason"] | null {
  if (/@deprecated\b/.test(line)) {
    return "@deprecated";
  }

  if (/_DEPRECATED\b/.test(line)) {
    return "_DEPRECATED";
  }

  return null;
}

function appearsBinary(content: Buffer): boolean {
  const sampleSize = Math.min(content.length, 8000);
  for (let i = 0; i < sampleSize; i += 1) {
    if (content[i] === 0) {
      return true;
    }
  }

  return false;
}

async function scanFile(filePath: string): Promise<Finding[]> {
  const findings: Finding[] = [];
  const contentBuffer = await fs.readFile(filePath);

  if (appearsBinary(contentBuffer)) {
    return findings;
  }

  const lines = contentBuffer.toString("utf8").split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const reason = detectReason(line);

    if (!reason) {
      continue;
    }

    findings.push({
      filePath,
      fileName: path.basename(filePath),
      line: i + 1,
      reason,
      lineText: line.trim(),
    });
  }

  return findings;
}

async function walkDirectory(
  rootDirAbsolute: string,
  currentDirAbsolute: string,
  ignorePatterns: string[],
): Promise<string[]> {
  const filePaths: string[] = [];
  const entries = await fs.readdir(currentDirAbsolute, { withFileTypes: true });

  for (const entry of entries) {
    const entryAbsolutePath = path.join(currentDirAbsolute, entry.name);
    const relativeToRoot = toPosixPath(
      path.relative(rootDirAbsolute, entryAbsolutePath),
    );

    if (isIgnored(relativeToRoot, ignorePatterns, entry.isDirectory())) {
      continue;
    }

    if (entry.isDirectory()) {
      const nestedFilePaths = await walkDirectory(
        rootDirAbsolute,
        entryAbsolutePath,
        ignorePatterns,
      );
      filePaths.push(...nestedFilePaths);
      continue;
    }

    if (entry.isFile()) {
      filePaths.push(entryAbsolutePath);
    }
  }

  return filePaths;
}

function formatNdjsonReport(
  rootDirAbsolute: string,
  findings: Finding[],
  scannedFilesCount: number,
  ignoredPatternsCount: number,
): string {
  const generatedAt = new Date().toISOString();
  const deprecatedTagCount = findings.filter(
    (finding) => finding.reason === "@deprecated",
  ).length;
  const deprecatedSuffixCount = findings.filter(
    (finding) => finding.reason === "_DEPRECATED",
  ).length;

  const summaryRecord = {
    type: "summary",
    generatedAt,
    rootDirectory: rootDirAbsolute,
    scannedFiles: scannedFilesCount,
    ignorePatternsLoaded: ignoredPatternsCount,
    findings: findings.length,
    breakdown: {
      deprecatedTag: deprecatedTagCount,
      deprecatedSuffix: deprecatedSuffixCount,
    },
  };

  const findingRecords = findings.map((finding, index) => ({
    type: "finding",
    index: index + 1,
    location: {
      relativePath: toPosixPath(
        path.relative(rootDirAbsolute, finding.filePath),
      ),
      fileName: finding.fileName,
      line: finding.line,
    },
    reason: finding.reason,
    matchedText: finding.lineText,
  }));

  return [summaryRecord, ...findingRecords]
    .map((record) => JSON.stringify(record))
    .join("\n");
}

function escapeMdCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function formatMarkdownReport(
  rootDirAbsolute: string,
  findings: Finding[],
  scannedFilesCount: number,
  ignoredPatternsCount: number,
): string {
  const generatedAt = new Date().toISOString();
  const deprecatedTagCount = findings.filter(
    (finding) => finding.reason === "@deprecated",
  ).length;
  const deprecatedSuffixCount = findings.filter(
    (finding) => finding.reason === "_DEPRECATED",
  ).length;

  const header = [
    "# Deprecated Code Scan Report",
    "",
    `- Generated at: ${generatedAt}`,
    `- Root directory: ${rootDirAbsolute}`,
    `- Files scanned: ${scannedFilesCount}`,
    `- Ignore patterns loaded: ${ignoredPatternsCount}`,
    `- Findings: ${findings.length}`,
    `  - @deprecated: ${deprecatedTagCount}`,
    `  - _DEPRECATED: ${deprecatedSuffixCount}`,
    "",
  ].join("\n");

  if (findings.length === 0) {
    return `${header}No deprecated code found.\n`;
  }

  const tableHeader = [
    "| # | folder | file | line | relative_path | reason | matched_text |",
    "|---:|---|---|---:|---|---|---|",
  ].join("\n");

  const tableRows = findings
    .map((finding, index) => {
      const relativePath = toPosixPath(
        path.relative(rootDirAbsolute, finding.filePath),
      );
      const folder = toPosixPath(path.dirname(relativePath));
      const normalizedFolder = folder === "." ? "(root)" : folder;
      return `| ${index + 1} | ${escapeMdCell(normalizedFolder)} | ${escapeMdCell(finding.fileName)} | ${finding.line} | ${escapeMdCell(relativePath)} | ${escapeMdCell(finding.reason)} | ${escapeMdCell(finding.lineText)} |`;
    })
    .join("\n");

  return `${header}\n${tableHeader}\n${tableRows}\n`;
}

function formatTextReport(
  rootDirAbsolute: string,
  findings: Finding[],
  scannedFilesCount: number,
  ignoredPatternsCount: number,
): string {
  const generatedAt = new Date().toISOString();
  const deprecatedTagCount = findings.filter(
    (finding) => finding.reason === "@deprecated",
  ).length;
  const deprecatedSuffixCount = findings.filter(
    (finding) => finding.reason === "_DEPRECATED",
  ).length;

  const header = [
    "Deprecated Code Scan Report",
    "==========================",
    `Generated at: ${generatedAt}`,
    `Root directory: ${rootDirAbsolute}`,
    `Files scanned: ${scannedFilesCount}`,
    `Ignore patterns loaded: ${ignoredPatternsCount}`,
    `Findings: ${findings.length}`,
    `  - @deprecated: ${deprecatedTagCount}`,
    `  - _DEPRECATED: ${deprecatedSuffixCount}`,
    "",
    "# | location | file | reason | matched_text",
    "-------------------------------------------",
  ].join("\n");

  if (findings.length === 0) {
    return `${header}\nNo deprecated code found.\n`;
  }

  const body = findings
    .map((finding, index) => {
      const relativePath = toPosixPath(
        path.relative(rootDirAbsolute, finding.filePath),
      );
      return `${index + 1} | ${relativePath}:${finding.line} | ${finding.fileName} | ${finding.reason} | ${finding.lineText}`;
    })
    .join("\n");

  return `${header}\n${body}\n`;
}

function getReportFormat(reportPath: string): "md" | "txt" | "ndjson" {
  const extension = path.extname(reportPath).toLowerCase();

  if (extension === ".md") {
    return "md";
  }

  if (extension === ".txt") {
    return "txt";
  }

  if (extension === ".ndjson") {
    return "ndjson";
  }

  return "md";
}

async function ensureParentDirExists(filePath: string): Promise<void> {
  const parentDir = path.dirname(filePath);
  await fs.mkdir(parentDir, { recursive: true });
}

async function main(): Promise<void> {
  const startedAt = Date.now();
  logBanner();

  const args = parseCliArgs(process.argv.slice(2));

  const rootDirAbsolute = path.resolve(args.rootDir);
  const reportPathAbsolute = path.resolve(args.reportPath);
  const ignoreConfigPathAbsolute = path.resolve(args.ignoreConfigPath);

  logInfo(`Root directory: ${rootDirAbsolute}`);
  logInfo(`Report path: ${reportPathAbsolute}`);
  logInfo(`Ignore config: ${ignoreConfigPathAbsolute}`);

  logStep("Validating input paths");
  const rootStat = await fs.stat(rootDirAbsolute).catch(() => null);
  if (!rootStat || !rootStat.isDirectory()) {
    throw new Error(`root_dir is not a valid directory: ${rootDirAbsolute}`);
  }

  const ignoreStat = await fs.stat(ignoreConfigPathAbsolute).catch(() => null);
  if (!ignoreStat || !ignoreStat.isFile()) {
    throw new Error(
      `ignore_config_path is not a valid file: ${ignoreConfigPathAbsolute}`,
    );
  }

  const reportFormat = getReportFormat(reportPathAbsolute);

  if (
    ![".md", ".txt", ".ndjson"].includes(
      path.extname(reportPathAbsolute).toLowerCase(),
    )
  ) {
    logInfo(
      "Unknown report extension. Falling back to Markdown-style content.",
    );
  }

  logStep("Loading ignore patterns from JSON");
  const ignorePatterns = await readIgnorePatternsFromJson(
    ignoreConfigPathAbsolute,
  );

  logStep("Walking directories");
  const filePaths = await walkDirectory(
    rootDirAbsolute,
    rootDirAbsolute,
    ignorePatterns,
  );

  logInfo(`Ignore patterns loaded: ${ignorePatterns.length}`);
  logInfo(`Files selected for scan: ${filePaths.length}`);

  logStep("Scanning files for deprecated markers");
  const findings: Finding[] = [];
  for (const filePath of filePaths) {
    const fileFindings = await scanFile(filePath);
    findings.push(...fileFindings);
  }

  const report =
    reportFormat === "ndjson"
      ? formatNdjsonReport(
          rootDirAbsolute,
          findings,
          filePaths.length,
          ignorePatterns.length,
        )
      : reportFormat === "txt"
        ? formatTextReport(
            rootDirAbsolute,
            findings,
            filePaths.length,
            ignorePatterns.length,
          )
        : formatMarkdownReport(
            rootDirAbsolute,
            findings,
            filePaths.length,
            ignorePatterns.length,
          );

  await ensureParentDirExists(reportPathAbsolute);
  logStep(`Writing ${reportFormat.toUpperCase()} report`);
  await fs.writeFile(reportPathAbsolute, `${report}\n`, "utf8");

  const deprecatedTagCount = findings.filter(
    (finding) => finding.reason === "@deprecated",
  ).length;
  const deprecatedSuffixCount = findings.filter(
    (finding) => finding.reason === "_DEPRECATED",
  ).length;

  logSuccess("Scan complete");
  console.log(`${paint("Result", "gray")}: report at ${reportPathAbsolute}`);
  console.log(`${paint("Result", "gray")}: total findings ${findings.length}`);
  console.log(
    `${paint("Breakdown", "gray")}: @deprecated=${deprecatedTagCount}, _DEPRECATED=${deprecatedSuffixCount}`,
  );
  console.log(
    `${paint("Duration", "gray")}: ${formatDurationMs(Date.now() - startedAt)}`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  logError(`Deprecated scan failed: ${message}`);
  console.error(paint("Run with --help for usage details.", "gray"));
  process.exit(1);
});
