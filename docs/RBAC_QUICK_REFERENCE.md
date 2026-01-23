# RBAC Quick Reference Card

## 🔥 Critical Actions (Do This First!)

### Security Vulnerabilities - Fix Now!

```typescript
// ❌ VULNERABLE - Currently public!
GET /api/user-system/users/:userId/wallet
GET /api/user-system/users/:userId/wallet/transactions
GET /api/economy-system/transactions

// ✅ SECURE - Add these middlewares:
router.get(
  "/:userId/wallet",
  authMiddleware.requireAuth(),
  authMiddleware.requireOwnershipOr(
    async (req) => ({ userId: req.params.userId }),
    ["admin"]
  ),
  controller.getUserWallet
);
```

---

## 🎯 Default Roles & Permissions

| Role | Events | Articles | Users | Wallets |
|------|--------|----------|-------|---------|
| **super_admin** | CRUD | CRUD | CRUD | CRUD |
| **admin** | CRUD | CRUD | RU-- | R--- |
| **moderator** | CRU- | -RU- | ---- | ---- |
| **member** | R--- | CRU* | ---- | R*-- |
| **guest** | R--- | R--- | ---- | ---- |

*Legend: C=Create, R=Read, U=Update, D=Delete, * =Own only, - =No access*

---

## 🛠️ Middleware Patterns

### Pattern 1: Require Permission
```typescript
router.post(
  "/events",
  authMiddleware.requireAuth(),
  authMiddleware.requirePermission("events", "write"),
  controller.create
);
```

### Pattern 2: Require Ownership
```typescript
router.patch(
  "/projects/:projectId",
  authMiddleware.requireAuth(),
  authMiddleware.requireOwnershipOr(
    async (req) => {
      const project = await service.getOne(req.params.projectId);
      return { userId: project.user_id };
    },
    ["admin"]
  ),
  controller.update
);
```

### Pattern 3: Admin Only
```typescript
router.post(
  "/roles",
  authMiddleware.requireAuth(),
  authMiddleware.requireAdminRole(),
  controller.createRole
);
```

### Pattern 4: Role or Permission
```typescript
router.get(
  "/transactions",
  authMiddleware.requireAuth(),
  authMiddleware.requireRoleOrPermission(
    ["admin", "super_admin"],
    "transactions",
    "read"
  ),
  controller.listTransactions
);
```

---

## 📁 File Locations

### Core Files to Edit

```
apps/nexus-api/src/
├── middlewares/
│   ├── auth.middleware.ts        # Add permission methods
│   └── tokenParser.ts            # Load roles/permissions
│
├── modules/rbacSystem/
│   ├── role.service.ts           # Role management
│   ├── role.repository.ts        # Database queries
│   ├── permission.service.ts     # NEW - Create this
│   ├── permission.repository.ts  # NEW - Create this
│   └── seed.ts                   # NEW - Seed roles
│
└── types/express/
    └── index.d.ts                # Add Request properties
```

---

## 🗄️ Database Tables

```sql
-- Already exist ✅
user_role               -- Role definitions
user_role_junction      -- User ↔ Role (M:N)
user_role_permission    -- Permissions per role

-- Query to check:
SELECT * FROM user_role;
SELECT * FROM user_role_junction WHERE user_id = '<user-id>';
SELECT * FROM user_role_permission WHERE user_role_id = '<role-id>';
```

---

## 🧪 Testing Commands

```bash
# Seed roles
pnpm --filter nexus-api seed:roles

# Test public endpoint
curl http://localhost:3000/api/event-system/events

# Test protected endpoint (should fail without token)
curl http://localhost:3000/api/event-system/events \
  -X POST \
  -H "Content-Type: application/json"

# Test with auth token
curl http://localhost:3000/api/event-system/events \
  -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event"}'
```

---

## 🚨 Common Errors & Fixes

### Error: "Cannot read property 'role' of undefined"
**Fix**: User roles not loaded in token parser
```typescript
// Add to tokenParser:
req.userRoles = rolesData?.list || [];
req.role = rolesData?.list[0]?.role_name || "guest";
```

### Error: Always getting 403 Forbidden
**Fix**: Check user has role assigned
```sql
SELECT * FROM user_role_junction WHERE user_id = '<user-id>';
```

### Error: Permissions not working
**Fix**: Verify permission exists for role
```sql
SELECT * FROM user_role_permission 
WHERE user_role_id = '<role-id>' 
AND resource_name = '<resource>';
```

---

## 📋 Implementation Checklist

### Phase 1: Core Setup (2-3 days)
- [ ] Create `permission.service.ts` & `permission.repository.ts`
- [ ] Add permission methods to `auth.middleware.ts`
- [ ] Update `tokenParser.ts` to load roles/permissions
- [ ] Update Express types in `types/express/index.d.ts`
- [ ] Test permission middleware works

### Phase 2: Secure Endpoints (2-3 days)
- [ ] Secure wallet endpoints
- [ ] Secure transaction endpoints
- [ ] Secure user list endpoint
- [ ] Add permission checks to event creation
- [ ] Add permission checks to article creation

### Phase 3: RBAC API (2-3 days)
- [ ] Create role CRUD endpoints
- [ ] Create permission management endpoints
- [ ] Create user-role assignment endpoints
- [ ] Test role management via API

### Phase 4: Seed & Test (1-2 days)
- [ ] Create `seed.ts` with default roles
- [ ] Run seed script
- [ ] Test with different user roles
- [ ] Verify all endpoints secured

---

## 🔑 Key Database Queries

### Get User Roles
```sql
SELECT ur.* 
FROM user_role ur
JOIN user_role_junction urj ON ur.id = urj.role_id
WHERE urj.user_id = '<user-id>';
```

### Get User Permissions
```sql
SELECT urp.* 
FROM user_role_permission urp
JOIN user_role_junction urj ON urp.user_role_id = urj.role_id
WHERE urj.user_id = '<user-id>';
```

### Assign Role to User
```sql
INSERT INTO user_role_junction (user_id, role_id)
VALUES ('<user-id>', '<role-id>');
```

### Create Permission
```sql
INSERT INTO user_role_permission (
  user_role_id, 
  resource_name, 
  can_read, 
  can_write, 
  can_update, 
  can_delete
) VALUES (
  '<role-id>', 
  'events', 
  true, 
  true, 
  true, 
  false
);
```

---

## 🎓 Permission Check Logic

```typescript
// Pseudocode for permission checking:
function canUserPerformAction(userId, resource, action) {
  // 1. Get user's roles
  roles = getUserRoles(userId);
  
  // 2. For each role, get permissions
  for (role of roles) {
    permissions = getRolePermissions(role.id);
    
    // 3. Check for wildcard permission (super admin)
    if (permissions.has("*") && permissions["*"][`can_${action}`]) {
      return true;
    }
    
    // 4. Check for specific resource permission
    if (permissions.has(resource) && permissions[resource][`can_${action}`]) {
      return true;
    }
  }
  
  return false;
}
```

---

## 📞 Quick Help

### Question: How do I make a user admin?
```sql
-- First, get the admin role ID
SELECT id FROM user_role WHERE role_name = 'admin';

-- Then assign to user
INSERT INTO user_role_junction (user_id, role_id)
VALUES ('<user-id>', '<admin-role-id>');
```

### Question: How do I check if endpoint is secure?
```bash
# Try accessing without auth - should fail
curl http://localhost:3000/api/endpoint

# Expected: 401 Unauthorized or 403 Forbidden
```

### Question: How do I test ownership checks?
```bash
# 1. Create resource as user A
# 2. Try to edit as user B (should fail)
# 3. Try to edit as admin (should succeed)
```

---

## 🚀 Start Here

1. **Read**: [RBAC_PROJECT_ANALYSIS_SUMMARY.md](./RBAC_PROJECT_ANALYSIS_SUMMARY.md)
2. **Code**: [RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md)
3. **Fix**: Start with Phase 1 security vulnerabilities
4. **Test**: Use curl commands above

---

## 📚 Full Documentation

- 📘 [Complete Analysis](./RBAC_ANALYSIS_AND_BLUEPRINT.md)
- 📊 [Architecture Diagrams](./RBAC_ARCHITECTURE_DIAGRAM.md)
- 📝 [Implementation Guide](./RBAC_IMPLEMENTATION_GUIDE.md)
- 🔒 [Security Audit](./API_SECURITY_AUDIT.md)
- 📋 [Project Summary](./RBAC_PROJECT_ANALYSIS_SUMMARY.md)

---

**Quick Ref Version**: 1.0  
**Print This**: Save as bookmark or print for desk reference  
**Updated**: January 23, 2026
