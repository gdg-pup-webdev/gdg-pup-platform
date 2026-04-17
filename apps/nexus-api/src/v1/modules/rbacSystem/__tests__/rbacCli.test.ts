import { describe, expect, it, vi } from "vitest";
import {
  RbacCliController,
  RbacCliLogger,
  runRbacCli,
} from "../cli/rbacCli";

function createMockController(): {
  controller: RbacCliController;
  mocks: {
    createRole: ReturnType<typeof vi.fn>;
    deleteRole: ReturnType<typeof vi.fn>;
    getRole: ReturnType<typeof vi.fn>;
    listRoles: ReturnType<typeof vi.fn>;
    attachPermissionToRole: ReturnType<typeof vi.fn>;
    removePermissionFromRole: ReturnType<typeof vi.fn>;
    getRolesAndPermissionsOfUser: ReturnType<typeof vi.fn>;
    assignRoleToUser: ReturnType<typeof vi.fn>;
    removeRoleFromUser: ReturnType<typeof vi.fn>;
  };
} {
  const mocks = {
    createRole: vi.fn().mockResolvedValue(undefined),
    deleteRole: vi.fn().mockResolvedValue(true),
    getRole: vi.fn().mockResolvedValue({
      id: "role-1",
      name: "role",
      description: "role description",
      permissions: [],
    }),
    listRoles: vi.fn().mockResolvedValue({ list: [], count: 0 }),
    attachPermissionToRole: vi.fn().mockResolvedValue(undefined),
    removePermissionFromRole: vi.fn().mockResolvedValue(undefined),
    getRolesAndPermissionsOfUser: vi.fn().mockResolvedValue([]),
    assignRoleToUser: vi.fn().mockResolvedValue(undefined),
    removeRoleFromUser: vi.fn().mockResolvedValue(undefined),
  };

  const controller: RbacCliController = {
    createRole: mocks.createRole,
    deleteRole: mocks.deleteRole,
    getRole: mocks.getRole,
    listRoles: mocks.listRoles,
    attachPermissionToRole: mocks.attachPermissionToRole,
    removePermissionFromRole: mocks.removePermissionFromRole,
    getRolesAndPermissionsOfUser: mocks.getRolesAndPermissionsOfUser,
    assignRoleToUser: mocks.assignRoleToUser,
    removeRoleFromUser: mocks.removeRoleFromUser,
  };

  return { controller, mocks };
}

function createMockLogger(): {
  logger: RbacCliLogger;
  info: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
} {
  const info = vi.fn();
  const error = vi.fn();

  const logger: RbacCliLogger = {
    info,
    error,
  };

  return { logger, info, error };
}

describe("runRbacCli", () => {
  it("returns usage error when no command is provided", async () => {
    const { controller } = createMockController();
    const { logger, info, error } = createMockLogger();

    const code = await runRbacCli([], { controller, logger });

    expect(code).toBe(1);
    expect(error).toHaveBeenCalledWith(
      "Missing command. No RBAC action was provided.",
    );
    expect(error).toHaveBeenCalledWith(
      "Hint: Start with one of the supported scopes: roles or users.",
    );
    expect(info).toHaveBeenCalledWith(expect.stringContaining("Usage: pnpm rbac"));
  });

  it("prints actionable usage error for unknown scope", async () => {
    const { controller } = createMockController();
    const { logger, error } = createMockLogger();

    const code = await runRbacCli(["unknown", "create"], {
      controller,
      logger,
    });

    expect(code).toBe(1);
    expect(error).toHaveBeenCalledWith(
      "error: unknown command 'unknown'",
    );
  });

  it("prints usage and exits 0 when help flag is provided", async () => {
    const { controller } = createMockController();
    const { logger, info } = createMockLogger();

    const code = await runRbacCli(["--help"], { controller, logger });

    expect(code).toBe(0);
    expect(info).toHaveBeenCalledWith(expect.stringContaining("Commands:"));
  });

  it("creates a role with multi-word description", async () => {
    const { controller, mocks } = createMockController();
    const { logger } = createMockLogger();

    const code = await runRbacCli(
      ["roles", "create", "core-admin", "Core", "admin", "role"],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(mocks.createRole).toHaveBeenCalledWith("core-admin", "Core admin role");
  });

  it("lists roles", async () => {
    const { controller, mocks } = createMockController();
    mocks.listRoles.mockResolvedValue({
      count: 2,
      list: [
        {
          id: "role-1",
          name: "admin",
          description: "Admin role",
          permissions: [],
        },
        {
          id: "role-2",
          name: "staff",
          description: "Staff role",
          permissions: [{ resource: "roles", action: "queries" }],
        },
      ],
    });
    const { logger, info } = createMockLogger();

    const code = await runRbacCli(["roles", "list"], { controller, logger });

    expect(code).toBe(0);
    expect(mocks.listRoles).toHaveBeenCalledWith(1, 1000);
    expect(info).toHaveBeenCalledWith(
      "Found 2 role(s). Showing 2 role(s).",
    );
    expect(info).toHaveBeenCalledWith(expect.stringContaining('"name": "admin"'));
  });

  it("lists permissions of a role", async () => {
    const { controller, mocks } = createMockController();
    mocks.getRole.mockResolvedValue({
      id: "role-1",
      name: "core-admin",
      description: "Core admin role",
      permissions: [{ resource: "roles", action: "mutations" }],
    });
    const { logger, info } = createMockLogger();

    const code = await runRbacCli(
      ["roles", "permissions", "list", "core-admin"],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(mocks.getRole).toHaveBeenCalledWith("core-admin");
    expect(info).toHaveBeenCalledWith(
      "Permissions for role 'core-admin' (1):",
    );
    expect(info).toHaveBeenCalledWith(
      expect.stringContaining('"resource": "roles"'),
    );
  });

  it("does not add duplicate permissions to a role", async () => {
    const { controller, mocks } = createMockController();
    mocks.getRole.mockResolvedValue({
      permissions: [{ resource: "roles", action: "mutations" }],
    });
    const { logger } = createMockLogger();

    const code = await runRbacCli(
      [
        "roles",
        "permissions",
        "add",
        "core-admin",
        "roles",
        "mutations",
      ],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(mocks.attachPermissionToRole).not.toHaveBeenCalled();
  });

  it("adds permission when role does not yet have it", async () => {
    const { controller, mocks } = createMockController();
    mocks.getRole.mockResolvedValue({ permissions: [] });
    const { logger } = createMockLogger();

    const code = await runRbacCli(
      [
        "roles",
        "permissions",
        "add",
        "core-admin",
        "roles",
        "mutations",
      ],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(mocks.attachPermissionToRole).toHaveBeenCalledWith(
      "core-admin",
      "roles",
      "mutations",
    );
  });

  it("does not assign duplicate roles to a user", async () => {
    const { controller, mocks } = createMockController();
    mocks.getRolesAndPermissionsOfUser.mockResolvedValue([
      {
        name: "core-admin",
        permissions: [],
      },
    ]);
    const { logger } = createMockLogger();

    const code = await runRbacCli(
      ["users", "roles", "add", "gdg-123", "core-admin"],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(mocks.assignRoleToUser).not.toHaveBeenCalled();
  });

  it("removes role from user when assignment exists", async () => {
    const { controller, mocks } = createMockController();
    mocks.getRolesAndPermissionsOfUser.mockResolvedValue([
      {
        name: "core-admin",
        permissions: [],
      },
    ]);
    const { logger } = createMockLogger();

    const code = await runRbacCli(
      ["users", "roles", "remove", "gdg-123", "core-admin"],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(mocks.removeRoleFromUser).toHaveBeenCalledWith("gdg-123", "core-admin");
  });

  it("lists roles of a user", async () => {
    const { controller, mocks } = createMockController();
    mocks.getRolesAndPermissionsOfUser.mockResolvedValue([
      { name: "core-admin", permissions: [] },
      { name: "member", permissions: [] },
    ]);
    const { logger, info } = createMockLogger();

    const code = await runRbacCli(
      ["users", "roles", "list", "gdg-123"],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(info).toHaveBeenCalledWith("Roles for user 'gdg-123' (2):");
    expect(info).toHaveBeenCalledWith(expect.stringContaining('"core-admin"'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('"member"'));
  });

  it("lists aggregated permissions of a user", async () => {
    const { controller, mocks } = createMockController();
    mocks.getRolesAndPermissionsOfUser.mockResolvedValue([
      {
        name: "core-admin",
        permissions: [
          { resource: "roles", action: "queries" },
          { resource: "roles", action: "mutations" },
        ],
      },
      {
        name: "staff",
        permissions: [{ resource: "roles", action: "queries" }],
      },
    ]);
    const { logger, info } = createMockLogger();

    const code = await runRbacCli(
      ["users", "permissions", "list", "gdg-123"],
      { controller, logger },
    );

    expect(code).toBe(0);
    expect(info).toHaveBeenCalledWith(
      "Aggregated permissions for user 'gdg-123' (2 unique):",
    );

    const payload = info.mock.calls
      .map((entry) => entry[0])
      .find((message) => message.includes('"fromRoles"'));

    expect(payload).toBeDefined();
    const parsedPayload = JSON.parse(payload as string) as Array<{
      resource: string;
      action: string;
      fromRoles: string[];
    }>;

    expect(parsedPayload).toEqual([
      {
        resource: "roles",
        action: "mutations",
        fromRoles: ["core-admin"],
      },
      {
        resource: "roles",
        action: "queries",
        fromRoles: ["core-admin", "staff"],
      },
    ]);
  });

  it("prints contextual runtime error details when controller throws", async () => {
    const { controller, mocks } = createMockController();
    const runtimeError = new Error("Role not found: core-admin");
    runtimeError.stack = "Error: Role not found: core-admin\n    at test-runtime-stack";
    mocks.getRole.mockRejectedValue(runtimeError);
    const { logger, error } = createMockLogger();

    const code = await runRbacCli(
      [
        "roles",
        "permissions",
        "add",
        "core-admin",
        "roles",
        "mutations",
      ],
      { controller, logger },
    );

    expect(code).toBe(1);
    expect(error).toHaveBeenCalledWith(
      "Failed command: pnpm rbac roles permissions add core-admin roles mutations",
    );
    expect(error).toHaveBeenCalledWith("Reason: Role was not found.");
    expect(error).toHaveBeenCalledWith(
      "Hint: Verify the role name or create the role first with: pnpm rbac roles create <roleName> <roleDescription>",
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("Details: Error: Role not found: core-admin"),
    );
    expect(error).toHaveBeenCalledWith(
      "Actual error: Error: Role not found: core-admin",
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("Stack:\nError: Role not found: core-admin"),
    );
  });

  it("maps user-not-found http-style errors to a specific reason and hint", async () => {
    const { controller, mocks } = createMockController();

    const httpLikeError = Object.assign(new Error("Internal Server Error"), {
      name: "HttpError",
      statusCode: 500,
      detail: "User not found: erwin",
    });
    httpLikeError.stack =
      "HttpError: Internal Server Error\n    at user-repository-test";

    mocks.getRolesAndPermissionsOfUser.mockRejectedValue(httpLikeError);

    const { logger, error } = createMockLogger();

    const code = await runRbacCli(
      ["users", "roles", "add", "erwin", "something"],
      { controller, logger },
    );

    expect(code).toBe(1);
    expect(error).toHaveBeenCalledWith(
      "Reason: User was not found.",
    );
    expect(error).toHaveBeenCalledWith(
      "Hint: Verify the gdgId exists in gdg_members and retry the command.",
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("detail: User not found: erwin"),
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("statusCode: 500"),
    );
  });
});