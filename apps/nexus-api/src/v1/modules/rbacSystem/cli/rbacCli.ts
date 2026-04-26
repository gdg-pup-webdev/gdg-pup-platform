import { Command, CommanderError } from "commander";

export type RbacPermission = {
  resource: string;
  action: string;
};

export type RbacRoleSummary = {
  id: string;
  name: string;
  description: string;
  permissions: RbacPermission[];
};

export type RbacCliRole = {
  name: string;
  permissions: RbacPermission[];
};

export type RbacCliController = {
  createRole(roleName: string, roleDescription: string): Promise<unknown>;
  deleteRole(roleName: string): Promise<boolean>;
  getRole(roleName: string): Promise<RbacRoleSummary>;
  listRoles(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ list: RbacRoleSummary[]; count: number }>;
  attachPermissionToRole(
    roleName: string,
    resource: string,
    action: string,
  ): Promise<unknown>;
  removePermissionFromRole(
    roleName: string,
    resource: string,
    action: string,
  ): Promise<unknown>;
  getRolesAndPermissionsOfUser(gdgId: string): Promise<RbacCliRole[]>;
  assignRoleToUser(gdgId: string, roleName: string): Promise<unknown>;
  removeRoleFromUser(gdgId: string, roleName: string): Promise<unknown>;
};

export type RbacCliLogger = {
  info(message: string): void;
  error(message: string): void;
};

export type RunRbacCliDependencies = {
  controller: RbacCliController;
  logger: RbacCliLogger;
};

class RbacCliRuntimeError extends Error {
  constructor(
    public readonly command: string,
    public readonly reason: string,
    public readonly hint: string,
    public readonly details: string,
    public readonly originalError: unknown,
  ) {
    super(reason);
  }

  override name = "RbacCliRuntimeError";
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    const errorWithMeta = error as Error & {
      statusCode?: unknown;
      detail?: unknown;
    };

    const statusCode =
      typeof errorWithMeta.statusCode === "number"
        ? ` | statusCode: ${errorWithMeta.statusCode}`
        : "";

    const detail =
      typeof errorWithMeta.detail === "string" &&
      errorWithMeta.detail.trim().length > 0
        ? ` | detail: ${errorWithMeta.detail}`
        : "";

    const cause =
      error.cause instanceof Error && error.cause.message.length > 0
        ? ` | cause: ${error.cause.name}: ${error.cause.message}`
        : "";

    return `${error.name}: ${error.message}${statusCode}${detail}${cause}`;
  }

  if (typeof error === "object" && error !== null) {
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
}

function getErrorStack(error: unknown): string | null {
  if (error instanceof Error && typeof error.stack === "string") {
    return error.stack;
  }

  return null;
}

function mapErrorToReasonAndHint(error: unknown): {
  reason: string;
  hint: string;
  details: string;
} {
  const details = formatError(error);
  const lower = details.toLowerCase();

  if (lower.includes("role not found")) {
    return {
      reason: "Role was not found.",
      hint: "Verify the role name or create the role first with: pnpm rbac roles create <roleName> <roleDescription>",
      details,
    };
  }

  if (lower.includes("user not found")) {
    return {
      reason: "User was not found.",
      hint: "Verify the gdgId exists in gdg_members and retry the command.",
      details,
    };
  }

  if (lower.includes("failed to query user")) {
    return {
      reason: "Failed to query the target user record.",
      hint: "If gdgId is correct, verify Supabase connectivity and service-role credentials in apps/nexus-api/.env.",
      details,
    };
  }

  if (
    lower.includes("duplicate") ||
    lower.includes("unique") ||
    lower.includes("already exists")
  ) {
    return {
      reason: "A uniqueness constraint blocked this operation.",
      hint: "Use a different value or remove the existing conflicting record before retrying.",
      details,
    };
  }

  if (lower.includes("foreign key")) {
    return {
      reason: "A relational integrity constraint blocked this operation.",
      hint: "Check related records (role assignments/permissions) and retry.",
      details,
    };
  }

  return {
    reason: "Unexpected runtime error while executing RBAC command.",
    hint: "Re-run with the same command and check the details line below for the root cause.",
    details,
  };
}

async function withControllerErrorContext<T>(
  command: string,
  fallbackHint: string,
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    const mapped = mapErrorToReasonAndHint(error);

    throw new RbacCliRuntimeError(
      command,
      mapped.reason,
      mapped.hint || fallbackHint,
      mapped.details,
      error,
    );
  }
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function aggregatePermissions(roles: RbacCliRole[]): {
  resource: string;
  action: string;
  fromRoles: string[];
}[] {
  const permissionMap = new Map<
    string,
    { resource: string; action: string; fromRoles: Set<string> }
  >();

  for (const role of roles) {
    for (const permission of role.permissions) {
      const key = `${permission.resource}::${permission.action}`;
      const existing = permissionMap.get(key);

      if (existing) {
        existing.fromRoles.add(role.name);
        continue;
      }

      permissionMap.set(key, {
        resource: permission.resource,
        action: permission.action,
        fromRoles: new Set([role.name]),
      });
    }
  }

  return [...permissionMap.values()]
    .map((entry) => ({
      resource: entry.resource,
      action: entry.action,
      fromRoles: [...entry.fromRoles].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => {
      if (a.resource === b.resource) {
        return a.action.localeCompare(b.action);
      }

      return a.resource.localeCompare(b.resource);
    });
}

function writeWithLogger(
  write: (message: string) => void,
  content: string,
): void {
  const normalized = content.replace(/\r\n/g, "\n").trimEnd();

  if (!normalized) {
    return;
  }

  for (const line of normalized.split("\n")) {
    write(line);
  }
}

function createProgram(deps: RunRbacCliDependencies): Command {
  const { controller, logger } = deps;

  const program = new Command();

  program
    .name("pnpm rbac")
    .description("RBAC CLI")
    .showHelpAfterError()
    .showSuggestionAfterError()
    .exitOverride();

  program.configureOutput({
    writeOut: (str: string) => {
      writeWithLogger(logger.info, str);
    },
    writeErr: (str: string) => {
      writeWithLogger(logger.error, str);
    },
  });

  program.addHelpText(
    "after",
    [
      "",
      "Examples:",
      "  pnpm rbac roles create core-admin \"Core admin role\"",
      "  pnpm rbac roles permissions add core-admin roles mutations",
      "  pnpm rbac users roles add gdg-123 core-admin",
      "  pnpm rbac users permissions list gdg-123",
    ].join("\n"),
  );

  const roles = program.command("roles").description("Manage RBAC roles.");

  roles
    .command("create <roleName> <roleDescription...>")
    .description("Create a role.")
    .action(async (roleName: string, roleDescriptionParts: string[]) => {
      const roleDescription = roleDescriptionParts.join(" ").trim();

      await withControllerErrorContext(
        `roles create ${roleName} ${roleDescription}`,
        "Check whether the role name already exists or violates database constraints.",
        () => controller.createRole(roleName, roleDescription),
      );

      logger.info(`Created role '${roleName}'.`);
    });

  roles
    .command("delete <roleName>")
    .description("Delete a role.")
    .action(async (roleName: string) => {
      await withControllerErrorContext(
        `roles delete ${roleName}`,
        "Verify the role exists and is not blocked by existing relationships.",
        () => controller.deleteRole(roleName),
      );

      logger.info(`Deleted role '${roleName}'.`);
    });

  roles
    .command("list")
    .description("List roles.")
    .action(async () => {
      const result = await withControllerErrorContext(
        "roles list",
        "Verify RBAC role records are reachable.",
        () => controller.listRoles(1, 1000),
      );

      logger.info(`Found ${result.count} role(s). Showing ${result.list.length} role(s).`);
      logger.info(
        formatJson(
          result.list.map((role) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            permissionsCount: role.permissions.length,
          })),
        ),
      );
    });

  const rolePermissions = roles
    .command("permissions")
    .description("Manage role permissions.");

  rolePermissions
    .command("list <roleName>")
    .description("List all permissions of a role.")
    .action(async (roleName: string) => {
      const role = await withControllerErrorContext(
        `roles permissions list ${roleName}`,
        "Verify the role name is correct and reachable.",
        () => controller.getRole(roleName),
      );

      logger.info(`Permissions for role '${roleName}' (${role.permissions.length}):`);
      logger.info(formatJson(role.permissions));
    });

  rolePermissions
    .command("add <roleName> <resource> <action>")
    .description("Attach a permission to a role.")
    .action(async (roleName: string, resource: string, action: string) => {
      const role = await withControllerErrorContext(
        `roles permissions add ${roleName} ${resource} ${action}`,
        "Verify the role name is correct and reachable.",
        () => controller.getRole(roleName),
      );

      const hasPermission = role.permissions.some((permission) => {
        return permission.resource === resource && permission.action === action;
      });

      if (hasPermission) {
        logger.info(`No-op: role '${roleName}' already has permission '${resource}:${action}'.`);
        return;
      }

      await withControllerErrorContext(
        `roles permissions add ${roleName} ${resource} ${action}`,
        "Verify role and permission values are valid for your RBAC schema.",
        () => controller.attachPermissionToRole(roleName, resource, action),
      );

      logger.info(`Added permission '${resource}:${action}' to role '${roleName}'.`);
    });

  rolePermissions
    .command("remove <roleName> <resource> <action>")
    .description("Remove a permission from a role.")
    .action(async (roleName: string, resource: string, action: string) => {
      const role = await withControllerErrorContext(
        `roles permissions remove ${roleName} ${resource} ${action}`,
        "Verify the role exists before removing permissions.",
        () => controller.getRole(roleName),
      );

      const hasPermission = role.permissions.some((permission) => {
        return permission.resource === resource && permission.action === action;
      });

      if (!hasPermission) {
        logger.info(`No-op: role '${roleName}' does not have permission '${resource}:${action}'.`);
        return;
      }

      await withControllerErrorContext(
        `roles permissions remove ${roleName} ${resource} ${action}`,
        "Verify role and permission values are correct.",
        () => controller.removePermissionFromRole(roleName, resource, action),
      );

      logger.info(`Removed permission '${resource}:${action}' from role '${roleName}'.`);
    });

  const users = program.command("users").description("Manage RBAC user assignments.");

  const userRoles = users.command("roles").description("Manage user roles.");

  userRoles
    .command("list <gdgId>")
    .description("List assigned roles of a user.")
    .action(async (gdgId: string) => {
      const rolesList = await withControllerErrorContext(
        `users roles list ${gdgId}`,
        "Verify the gdgId exists and RBAC data is reachable.",
        () => controller.getRolesAndPermissionsOfUser(gdgId),
      );

      const roleNames = rolesList
        .map((role) => role.name)
        .sort((a, b) => a.localeCompare(b));

      logger.info(`Roles for user '${gdgId}' (${roleNames.length}):`);
      logger.info(formatJson(roleNames));
    });

  userRoles
    .command("add <gdgId> <roleName>")
    .description("Assign a role to a user.")
    .action(async (gdgId: string, roleName: string) => {
      const rolesList = await withControllerErrorContext(
        `users roles add ${gdgId} ${roleName}`,
        "Verify the gdgId exists and RBAC data is reachable.",
        () => controller.getRolesAndPermissionsOfUser(gdgId),
      );

      const alreadyAssigned = rolesList.some((role) => role.name === roleName);

      if (alreadyAssigned) {
        logger.info(`No-op: user '${gdgId}' already has role '${roleName}'.`);
        return;
      }

      await withControllerErrorContext(
        `users roles add ${gdgId} ${roleName}`,
        "Verify both gdgId and roleName are valid.",
        () => controller.assignRoleToUser(gdgId, roleName),
      );

      logger.info(`Assigned role '${roleName}' to user '${gdgId}'.`);
    });

  userRoles
    .command("remove <gdgId> <roleName>")
    .description("Remove a role from a user.")
    .action(async (gdgId: string, roleName: string) => {
      const rolesList = await withControllerErrorContext(
        `users roles remove ${gdgId} ${roleName}`,
        "Verify the gdgId exists and RBAC data is reachable.",
        () => controller.getRolesAndPermissionsOfUser(gdgId),
      );

      const alreadyAssigned = rolesList.some((role) => role.name === roleName);

      if (!alreadyAssigned) {
        logger.info(`No-op: user '${gdgId}' does not have role '${roleName}'.`);
        return;
      }

      await withControllerErrorContext(
        `users roles remove ${gdgId} ${roleName}`,
        "Verify both gdgId and roleName are valid.",
        () => controller.removeRoleFromUser(gdgId, roleName),
      );

      logger.info(`Removed role '${roleName}' from user '${gdgId}'.`);
    });

  const userPermissions = users
    .command("permissions")
    .description("Inspect user permissions.");

  userPermissions
    .command("list <gdgId>")
    .description("List aggregated permissions of a user.")
    .action(async (gdgId: string) => {
      const rolesList = await withControllerErrorContext(
        `users permissions list ${gdgId}`,
        "Verify the gdgId exists and RBAC data is reachable.",
        () => controller.getRolesAndPermissionsOfUser(gdgId),
      );

      const aggregatedPermissions = aggregatePermissions(rolesList);

      logger.info(
        `Aggregated permissions for user '${gdgId}' (${aggregatedPermissions.length} unique):`,
      );
      logger.info(formatJson(aggregatedPermissions));
    });

  return program;
}

function printRuntimeError(error: RbacCliRuntimeError, logger: RbacCliLogger): void {
  logger.error(`Failed command: pnpm rbac ${error.command}`);
  logger.error(`Reason: ${error.reason}`);
  logger.error(`Hint: ${error.hint}`);
  logger.error(`Details: ${error.details}`);
  logger.error(`Actual error: ${formatError(error.originalError)}`);

  const stack = getErrorStack(error.originalError);
  if (stack) {
    logger.error(`Stack:\n${stack}`);
  }
}

export async function runRbacCli(
  argv: string[],
  deps: RunRbacCliDependencies,
): Promise<number> {
  const { logger } = deps;
  const program = createProgram(deps);

  if (argv.length === 0) {
    logger.error("Missing command. No RBAC action was provided.");
    logger.error("Hint: Start with one of the supported scopes: roles or users.");
    writeWithLogger(logger.info, program.helpInformation());
    return 1;
  }

  try {
    await program.parseAsync(argv, { from: "user" });
    return 0;
  } catch (error: unknown) {
    if (error instanceof RbacCliRuntimeError) {
      printRuntimeError(error, logger);
      return 1;
    }

    if (error instanceof CommanderError) {
      const commanderError = error as CommanderError & {
        code?: unknown;
        exitCode?: unknown;
      };

      if (commanderError.code === "commander.helpDisplayed") {
        return 0;
      }

      return typeof commanderError.exitCode === "number"
        ? commanderError.exitCode
        : 1;
    }

    logger.error("RBAC command failed with an unclassified error.");
    logger.error(`Actual error: ${formatError(error)}`);
    const stack = getErrorStack(error);
    if (stack) {
      logger.error(`Stack:\n${stack}`);
    }
    return 1;
  }
}
