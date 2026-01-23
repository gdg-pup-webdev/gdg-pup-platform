# RBAC Quick Implementation Guide

## 🎯 Quick Start Checklist

This is a practical, step-by-step guide to implement RBAC in your GDG PUP Platform.

---

## Phase 1: Core RBAC Infrastructure (Priority 🔥)

### Step 1.1: Enhanced Permission Service

**File**: `apps/nexus-api/src/modules/rbacSystem/permission.service.ts`

```typescript
import { PermissionRepository, permissionRepositoryInstance } from "./permission.repository.js";
import { Tables } from "@/types/supabase.types.js";

type Permission = Tables<"user_role_permission">;

export class PermissionService {
  constructor(
    private permissionRepository: PermissionRepository = permissionRepositoryInstance
  ) {}

  /**
   * Check if user has specific permission on a resource
   */
  async userHasPermission(
    userId: string,
    resourceName: string,
    action: "read" | "write" | "update" | "delete"
  ): Promise<boolean> {
    const { data, error } = await this.permissionRepository.getPermissionsForUser(userId);
    
    if (error || !data) return false;

    // Check for wildcard permission (super admin)
    const wildcardPerm = data.find(p => p.resource_name === "*");
    if (wildcardPerm && wildcardPerm[`can_${action}`]) return true;

    // Check for specific resource permission
    const resourcePerm = data.find(p => p.resource_name === resourceName);
    return resourcePerm ? resourcePerm[`can_${action}`] : false;
  }

  /**
   * Get all permissions for a user (across all their roles)
   */
  async getUserPermissions(userId: string) {
    return await this.permissionRepository.getPermissionsForUser(userId);
  }

  /**
   * Get permissions for a specific role
   */
  async getRolePermissions(roleId: string) {
    return await this.permissionRepository.getPermissionsByRoleId(roleId);
  }

  /**
   * Create or update permission for a role
   */
  async setRolePermission(roleId: string, permission: Partial<Permission>) {
    return await this.permissionRepository.upsertPermission({
      user_role_id: roleId,
      ...permission
    });
  }

  /**
   * Delete a permission
   */
  async deletePermission(permissionId: string) {
    return await this.permissionRepository.deletePermission(permissionId);
  }
}

export const permissionServiceInstance = new PermissionService();
```

### Step 1.2: Permission Repository

**File**: `apps/nexus-api/src/modules/rbacSystem/permission.repository.ts`

```typescript
import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { Tables } from "@/types/supabase.types.js";

type Permission = Tables<"user_role_permission">;

export class PermissionRepository {
  table = "user_role_permission";

  /**
   * Get all permissions for a user across all their roles
   */
  async getPermissionsForUser(userId: string) {
    const { data, error } = await supabase
      .from("user_role_junction")
      .select(`
        user_role_id,
        user_role!inner(
          id,
          role_name,
          user_role_permission(*)
        )
      `)
      .eq("user_id", userId);

    if (error) throw new DatabaseError(error.message);

    // Flatten permissions from all roles
    const permissions: Permission[] = [];
    data?.forEach((junction) => {
      const role = junction.user_role as any;
      if (role?.user_role_permission) {
        permissions.push(...role.user_role_permission);
      }
    });

    return { data: permissions, error: null };
  }

  /**
   * Get permissions for a specific role
   */
  async getPermissionsByRoleId(roleId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("user_role_id", roleId);

    if (error) throw new DatabaseError(error.message);
    return { data, error: null };
  }

  /**
   * Create or update a permission
   */
  async upsertPermission(permission: Partial<Permission>) {
    const { data, error } = await supabase
      .from(this.table)
      .upsert(permission)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return { data, error: null };
  }

  /**
   * Delete a permission
   */
  async deletePermission(permissionId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", permissionId);

    if (error) throw new DatabaseError(error.message);
    return { data, error: null };
  }
}

export const permissionRepositoryInstance = new PermissionRepository();
```

### Step 1.3: Enhanced Auth Middleware

**File**: `apps/nexus-api/src/middlewares/auth.middleware.ts`

```typescript
import { ServerError } from "@/classes/ServerError.js";
import { permissionServiceInstance, PermissionService } from "@/modules/rbacSystem/permission.service.js";
import { RequestHandler } from "express";

export class AuthMiddleware {
  constructor(
    private permissionService: PermissionService = permissionServiceInstance
  ) {}

  /**
   * Ensure user is authenticated
   */
  requireAuth = (): RequestHandler => (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw ServerError.unauthorized();
    }

    next();
  };

  /**
   * Require specific role
   */
  requireAdminRole = (): RequestHandler => (req, res, next) => {
    const role = req.role;

    if (!role || role !== "admin") {
      throw ServerError.forbidden(
        "You must be an admin to perform this action."
      );
    }

    next();
  };

  /**
   * Require any of the specified roles
   */
  requireAnyOfTheseRoles =
    (allowedRoles: string[]): RequestHandler =>
    (req, res, next) => {
      const userRole = req.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw ServerError.forbidden(
          "You do not have permission to perform this action."
        );
      }

      next();
    };

  /**
   * 🆕 Check permission on a resource
   */
  requirePermission =
    (
      resourceName: string,
      action: "read" | "write" | "update" | "delete"
    ): RequestHandler =>
    async (req, res, next) => {
      try {
        const user = req.user;

        if (!user) {
          throw ServerError.unauthorized();
        }

        const hasPermission = await this.permissionService.userHasPermission(
          user.id,
          resourceName,
          action
        );

        if (!hasPermission) {
          throw ServerError.forbidden(
            `You don't have ${action} permission on ${resourceName}`
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };

  /**
   * 🆕 Check resource ownership or allow admin override
   */
  requireOwnershipOr =
    (
      resourceGetter: (req: any) => Promise<{ userId: string }>,
      allowedRoles: string[] = ["admin", "super_admin"]
    ): RequestHandler =>
    async (req, res, next) => {
      try {
        const user = req.user;

        if (!user) {
          throw ServerError.unauthorized();
        }

        // Check if user has allowed role
        const userRole = req.role;
        if (userRole && allowedRoles.includes(userRole)) {
          return next();
        }

        // Check ownership
        const resource = await resourceGetter(req);
        if (resource.userId !== user.id) {
          throw ServerError.forbidden(
            "You can only access your own resources"
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };

  /**
   * 🆕 Combined role or permission check
   */
  requireRoleOrPermission =
    (
      allowedRoles: string[],
      resourceName: string,
      action: "read" | "write" | "update" | "delete"
    ): RequestHandler =>
    async (req, res, next) => {
      try {
        const user = req.user;

        if (!user) {
          throw ServerError.unauthorized();
        }

        // Check role first
        const userRole = req.role;
        if (userRole && allowedRoles.includes(userRole)) {
          return next();
        }

        // Check permission
        const hasPermission = await this.permissionService.userHasPermission(
          user.id,
          resourceName,
          action
        );

        if (!hasPermission) {
          throw ServerError.forbidden(
            "Insufficient permissions for this action"
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };
}

export const authMiddlewareInstance = new AuthMiddleware();
```

### Step 1.4: Update Token Parser

**File**: `apps/nexus-api/src/middlewares/tokenParser.ts`

Add role and permission loading:

```typescript
import { RequestHandler } from "express";
import { supabase } from "../lib/supabase.js";
import { roleServiceInstance } from "@/modules/rbacSystem/role.service.js";
import { permissionServiceInstance } from "@/modules/rbacSystem/permission.service.js";

export const tokenParserFromHeaders: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const supabaseAccessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    const googleAccessToken = req.headers["x-google-access-token"] as
      | string
      | undefined;

    if (supabaseAccessToken) {
      const { data: user, error: userError } =
        await supabase.auth.getUser(supabaseAccessToken);

      if (!userError && user) {
        req.user = user.user;

        // 🆕 Load user roles
        const { data: rolesData } = await roleServiceInstance.getRolesOfUser(user.user.id);
        req.userRoles = rolesData?.list || [];
        
        // Set primary role (first role or 'guest')
        req.role = rolesData?.list[0]?.role_name || "guest";

        // 🆕 Load user permissions
        const { data: permissionsData } = await permissionServiceInstance.getUserPermissions(user.user.id);
        req.userPermissions = permissionsData || [];
      }
    }

    req.supabaseAccessToken = supabaseAccessToken;
    req.googleAccessToken = googleAccessToken;
    return next();
  } catch (error) {
    // Fallback on error
    req.user = undefined;
    req.role = "guest";
    req.userRoles = [];
    req.userPermissions = [];
    req.supabaseAccessToken = undefined;
    req.googleAccessToken = undefined;
    return next();
  }
};
```

### Step 1.5: Update Type Definitions

**File**: `apps/nexus-api/src/types/express/index.d.ts`

```typescript
import { User } from "@supabase/supabase-js";
import { Tables } from "@/types/supabase.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      role?: string;
      userRoles?: Tables<"user_role">[];
      userPermissions?: Tables<"user_role_permission">[];
      supabaseAccessToken?: string;
      googleAccessToken?: string;
    }
  }
}

export {};
```

---

## Phase 2: RBAC API Endpoints

### Step 2.1: Role Management Endpoints

**File**: `apps/nexus-api/src/modules/rbacSystem/role.controller.ts`

```typescript
import { ServiceError } from "@/classes/ServerError";
import { RoleService, roleServiceInstance } from "@/modules/rbacSystem/role.service";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

export class RoleController {
  constructor(private roleService: RoleService = roleServiceInstance) {}

  // List all roles or filter by userId
  getRolesOrUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.GET,
    async ({ input, output, ctx }) => {
      const userId = input.query.userId;

      const { data, error } = await tryCatch(
        async () => await this.roleService.getRolesOfUser(userId),
        "getting user roles"
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User roles fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / input.query.page.size),
        },
      });
    }
  );

  // 🆕 Create a new role (admin only)
  createRole: RequestHandler = async (req, res, next) => {
    try {
      const { role_name, description } = req.body;

      const { data, error } = await this.roleService.createRole({
        role_name,
        description,
      });

      if (error) throw new ServiceError(error.message);

      res.status(201).json({
        status: "success",
        message: "Role created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // 🆕 Update role
  updateRole: RequestHandler = async (req, res, next) => {
    try {
      const { roleId } = req.params;
      const updates = req.body;

      const { data, error } = await this.roleService.updateRole(roleId, updates);

      if (error) throw new ServiceError(error.message);

      res.json({
        status: "success",
        message: "Role updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // 🆕 Delete role
  deleteRole: RequestHandler = async (req, res, next) => {
    try {
      const { roleId } = req.params;

      const { error } = await this.roleService.deleteRole(roleId);

      if (error) throw new ServiceError(error.message);

      res.json({
        status: "success",
        message: "Role deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // 🆕 Assign role to user
  assignRoleToUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      const { data, error } = await this.roleService.assignRoleToUser(userId, roleId);

      if (error) throw new ServiceError(error.message);

      res.json({
        status: "success",
        message: "Role assigned successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  // 🆕 Remove role from user
  removeRoleFromUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId, roleId } = req.params;

      const { error } = await this.roleService.removeRoleFromUser(userId, roleId);

      if (error) throw new ServiceError(error.message);

      res.json({
        status: "success",
        message: "Role removed successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const roleControllerInstance = new RoleController();
```

### Step 2.2: Update Role Routes

**File**: `apps/nexus-api/src/modules/rbacSystem/role.route.ts`

```typescript
import { Router } from "express";
import { RoleController, roleControllerInstance } from "./role.controller";
import { AuthMiddleware, authMiddlewareInstance } from "@/middlewares/auth.middleware";

export class RoleRouter {
  constructor(
    private roleController: RoleController = roleControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance
  ) {}

  getRouter = (): Router => {
    const router = Router();

    // Public: List all roles or get user roles
    router.get("/", this.roleController.getRolesOrUser);

    // Admin only: Create role
    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.authMiddleware.requireAdminRole(),
      this.roleController.createRole
    );

    // Admin only: Update role
    router.put(
      "/:roleId",
      this.authMiddleware.requireAuth(),
      this.authMiddleware.requireAdminRole(),
      this.roleController.updateRole
    );

    // Admin only: Delete role
    router.delete(
      "/:roleId",
      this.authMiddleware.requireAuth(),
      this.authMiddleware.requireAdminRole(),
      this.roleController.deleteRole
    );

    return router;
  };
}

export const roleRouterInstance = new RoleRouter();
```

### Step 2.3: User-Role Management Routes

**File**: `apps/nexus-api/src/modules/rbacSystem/user-role.route.ts` (NEW)

```typescript
import { Router } from "express";
import { RoleController, roleControllerInstance } from "./role.controller";
import { AuthMiddleware, authMiddlewareInstance } from "@/middlewares/auth.middleware";

export class UserRoleRouter {
  constructor(
    private roleController: RoleController = roleControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance
  ) {}

  getRouter = (): Router => {
    const router = Router();

    // Admin only: Assign role to user
    router.post(
      "/:userId/roles",
      this.authMiddleware.requireAuth(),
      this.authMiddleware.requireAdminRole(),
      this.roleController.assignRoleToUser
    );

    // Admin only: Remove role from user
    router.delete(
      "/:userId/roles/:roleId",
      this.authMiddleware.requireAuth(),
      this.authMiddleware.requireAdminRole(),
      this.roleController.removeRoleFromUser
    );

    return router;
  };
}

export const userRoleRouterInstance = new UserRoleRouter();
```

### Step 2.4: Update RBAC Index

**File**: `apps/nexus-api/src/modules/rbacSystem/index.ts`

```typescript
import { Router } from "express";
import { RoleRouter, roleRouterInstance } from "./role.route";
import { UserRoleRouter, userRoleRouterInstance } from "./user-role.route";

export class RbacSystemRouter {
  constructor(
    private roleRouter: RoleRouter = roleRouterInstance,
    private userRoleRouter: UserRoleRouter = userRoleRouterInstance
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/roles", this.roleRouter.getRouter());
    router.use("/users", this.userRoleRouter.getRouter());

    return router;
  };
}

export const rbacSystemRouterInstance = new RbacSystemRouter();
```

---

## Phase 3: Secure Existing Routes

### Example: Secure Event System

**File**: `apps/nexus-api/src/modules/eventSystem/event.route.ts`

```typescript
// Before
router.post("/", this.authMiddleware.requireAuth(), this.eventController.create);

// After
router.post(
  "/",
  this.authMiddleware.requireAuth(),
  this.authMiddleware.requirePermission("events", "write"),
  this.eventController.create
);

router.put(
  "/:eventId",
  this.authMiddleware.requireAuth(),
  this.authMiddleware.requirePermission("events", "update"),
  this.eventController.update
);

router.delete(
  "/:eventId",
  this.authMiddleware.requireAuth(),
  this.authMiddleware.requirePermission("events", "delete"),
  this.eventController.delete
);
```

### Example: Secure User Projects

**File**: `apps/nexus-api/src/modules/userResourceSystem/project.route.ts`

```typescript
import { projectServiceInstance } from "./project.service";

router.patch(
  "/:projectId",
  this.authMiddleware.requireAuth(),
  this.authMiddleware.requireOwnershipOr(
    async (req) => {
      const project = await projectServiceInstance.getOne(req.params.projectId);
      return { userId: project.data.user_id };
    },
    ["admin"]
  ),
  this.projectController.update
);
```

---

## Phase 4: Database Seed Script

### Step 4.1: Create Seed Script

**File**: `apps/nexus-api/src/modules/rbacSystem/seed.ts`

```typescript
import { supabase } from "@/lib/supabase";

interface RoleDefinition {
  role_name: string;
  description: string;
  permissions: {
    resource_name: string;
    can_read: boolean;
    can_write: boolean;
    can_update: boolean;
    can_delete: boolean;
  }[];
}

const DEFAULT_ROLES: RoleDefinition[] = [
  {
    role_name: "super_admin",
    description: "Full system access and control",
    permissions: [
      {
        resource_name: "*",
        can_read: true,
        can_write: true,
        can_update: true,
        can_delete: true,
      },
    ],
  },
  {
    role_name: "admin",
    description: "Administrative access to manage content and users",
    permissions: [
      { resource_name: "events", can_read: true, can_write: true, can_update: true, can_delete: true },
      { resource_name: "articles", can_read: true, can_write: true, can_update: true, can_delete: true },
      { resource_name: "resources", can_read: true, can_write: true, can_update: true, can_delete: true },
      { resource_name: "users", can_read: true, can_write: false, can_update: true, can_delete: false },
    ],
  },
  {
    role_name: "moderator",
    description: "Content moderation and event management",
    permissions: [
      { resource_name: "events", can_read: true, can_write: true, can_update: true, can_delete: false },
      { resource_name: "articles", can_read: true, can_write: false, can_update: true, can_delete: false },
      { resource_name: "resources", can_read: true, can_write: true, can_update: true, can_delete: false },
    ],
  },
  {
    role_name: "member",
    description: "Verified GDG member with content creation rights",
    permissions: [
      { resource_name: "events", can_read: true, can_write: false, can_update: false, can_delete: false },
      { resource_name: "articles", can_read: true, can_write: true, can_update: true, can_delete: false },
      { resource_name: "projects", can_read: true, can_write: true, can_update: true, can_delete: true },
    ],
  },
  {
    role_name: "guest",
    description: "Public read-only access",
    permissions: [
      { resource_name: "events", can_read: true, can_write: false, can_update: false, can_delete: false },
      { resource_name: "articles", can_read: true, can_write: false, can_update: false, can_delete: false },
      { resource_name: "resources", can_read: true, can_write: false, can_update: false, can_delete: false },
    ],
  },
];

export async function seedRoles() {
  console.log("🌱 Seeding default roles...");

  for (const roleDef of DEFAULT_ROLES) {
    // Create role
    const { data: role, error: roleError } = await supabase
      .from("user_role")
      .upsert({ role_name: roleDef.role_name, description: roleDef.description }, { onConflict: "role_name" })
      .select()
      .single();

    if (roleError) {
      console.error(`❌ Error creating role ${roleDef.role_name}:`, roleError);
      continue;
    }

    console.log(`✅ Created/Updated role: ${role.role_name}`);

    // Create permissions
    for (const perm of roleDef.permissions) {
      const { error: permError } = await supabase.from("user_role_permission").upsert(
        {
          user_role_id: role.id,
          ...perm,
        },
        {
          onConflict: "user_role_id,resource_name",
        }
      );

      if (permError) {
        console.error(`❌ Error creating permission for ${roleDef.role_name}:`, permError);
      } else {
        console.log(`   ✓ Permission: ${perm.resource_name}`);
      }
    }
  }

  console.log("✨ Seed complete!");
}

// Run if called directly
if (require.main === module) {
  seedRoles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
```

### Step 4.2: Add Seed Command

**File**: `apps/nexus-api/package.json`

```json
{
  "scripts": {
    "seed:roles": "tsx src/modules/rbacSystem/seed.ts"
  }
}
```

---

## Testing Your Implementation

### Test 1: Verify Roles Exist

```bash
curl http://localhost:3000/api/rbac-system/roles
```

### Test 2: Test Permission Check

```bash
# Create event with member role (should fail)
curl -X POST http://localhost:3000/api/event-system/events \
  -H "Authorization: Bearer <member-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Event"}'

# Expected: 403 Forbidden
```

### Test 3: Test Ownership

```bash
# Update own project (should succeed)
curl -X PATCH http://localhost:3000/api/user-resource-system/projects/<own-project-id> \
  -H "Authorization: Bearer <user-token>"

# Update others' project (should fail unless admin)
curl -X PATCH http://localhost:3000/api/user-resource-system/projects/<other-user-project-id> \
  -H "Authorization: Bearer <user-token>"

# Expected: 403 Forbidden
```

---

## Common Issues & Solutions

### Issue: Permissions not loading

**Solution**: Check tokenParser is included in middleware chain:
```typescript
// In loaders/setup.loader.ts
app.use(tokenParserFromHeaders);
```

### Issue: Always getting 403

**Solution**: Verify user has role assigned:
```sql
SELECT * FROM user_role_junction WHERE user_id = '<user-id>';
```

### Issue: Role changes not reflecting

**Solution**: Clear any caches or re-login to refresh token.

---

## Quick Command Reference

```bash
# Seed roles
pnpm --filter nexus-api seed:roles

# Check database
psql <database-url>
> SELECT * FROM user_role;
> SELECT * FROM user_role_permission;

# Test endpoint with auth
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/endpoint
```

---

**Guide Version**: 1.0  
**Last Updated**: January 23, 2026  
**Estimated Implementation Time**: 2-3 days
