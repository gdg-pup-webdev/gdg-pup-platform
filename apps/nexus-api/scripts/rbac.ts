declare const process: {
  argv: string[];
  exitCode?: number;
};

const processRef = process;

function formatBootstrapError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}

function printBootstrapHint(details: string): void {
  const lower = details.toLowerCase();

  if (
    lower.includes("missing supabase url") ||
    lower.includes("missing supabase") ||
    lower.includes("secret key")
  ) {
    console.error(
      "Hint: Ensure SUPABASE_URL and SUPABASE_SECRET_KEY are set in apps/nexus-api/.env.",
    );
    return;
  }

  console.error(
    "Hint: Verify apps/nexus-api/.env exists and run the command from apps/nexus-api or with --filter nexus-api.",
  );
}

async function main(): Promise<void> {
  try {
    const [{ runRbacCli }, { rbacController }] = await Promise.all([
      import("../src/v1/modules/rbacSystem/cli/rbacCli"),
      import("../src/v1/modules/rbacSystem"),
    ]);

    const exitCode = await runRbacCli(processRef.argv.slice(2), {
      controller: rbacController,
      logger: {
        info: (message: string) => {
          console.log(message);
        },
        error: (message: string) => {
          console.error(message);
        },
      },
    });

    processRef.exitCode = exitCode;
  } catch (error: unknown) {
    const details = formatBootstrapError(error);
    console.error("RBAC CLI bootstrap failed.");
    console.error(`Actual error: ${details}`);
    if (error instanceof Error && error.stack) {
      console.error(`Stack:\n${error.stack}`);
    }
    printBootstrapHint(details);
    processRef.exitCode = 1;
  }
}

void main();