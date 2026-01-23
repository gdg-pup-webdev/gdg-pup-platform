import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase.types.js";
import {
  INITIAL_ROLES,
  INITIAL_PERMISSION_MATRIX,
  generatePermissionsForRole,
} from "./initial-roles.seed.js";
import { configs } from "@/configs/configs.js";

console.log("Supabase url:", configs.supabase_url);
console.log("Supabase key:", configs.supabase_key);

const supabase = createClient<Database>(
  configs.supabase_url,
  configs.supabase_key,
);

async function seedRBAC() {
  console.log("Seeding RBAC system...\n");

  try {
    console.log("Creating roles...");
    const { data: roles, error: rolesError } = await supabase
      .from("user_role")
      .insert(INITIAL_ROLES)
      .select();

    if (rolesError) {
      throw new Error(`Failed to create roles: ${rolesError.message}`);
    }

    console.log(`Created ${roles.length} roles:`);
    roles.forEach((role) => {
      console.log(`   - ${role.role_name}: ${role.description}`);
    });

    console.log("\n Creating permissions...");

    for (const role of roles) {
      const permissions = generatePermissionsForRole(
        role.id,
        role.role_name as keyof typeof INITIAL_PERMISSION_MATRIX,
      );

      const { data: createdPerms, error: permsError } = await supabase
        .from("user_role_permission")
        .insert(permissions)
        .select();

      if (permsError) {
        throw new Error(
          `Failed to create permissions for ${role.role_name}: ${permsError.message}`,
        );
      }

      console.log(
        `Created ${createdPerms.length} permissions for ${role.role_name}`,
      );
      createdPerms.forEach((perm) => {
        const actions = [];

        if (perm.can_read) actions.push("read");
        if (perm.can_write) actions.push("write");
        if (perm.can_update) actions.push("update");
        if (perm.can_delete) actions.push("delete");
        console.log(`   - ${perm.resource_name}: [${actions.join(", ")}]`);
      });
    }

    console.log("\n RBAC seeding completed successfully!");
    console.log("\n Summary:");
    console.log(`   Roles: ${roles.length}`);
    console.log(`   Resources: 1 (events)`);
    console.log(`   Total permissions: ${roles.length * 1}`);
  } catch (e) {
    console.error("Seeding failed:", e);
    process.exit(1);
  }
}

// Run seeder
seedRBAC();
