import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase.types.js";
import { configs } from "@/configs/configs.js";
import { INITIAL_ROLES } from "./initial-roles.seed.js";

const supabase = createClient<Database>(
  configs.supabaseUrl,
  configs.supabaseKey,
);

async function seedRBACAndUsers() {
  console.log("Seeding RBAC system and test users...\n");

  // 1. Seed roles
  console.log("Creating roles...");
  const { data: roles, error: rolesError } = await supabase
    .from("user_role")
    .insert(INITIAL_ROLES)
    .select();

  if (rolesError)
    throw new Error(`Failed to create roles: ${rolesError.message}`);

  // 2. Seed test users and assign roles
  const testUsers = [
    {
      email: "moderator@gdgpup.test",
      password: "Test123!@#",
      role: "moderator",
      display_name: "Moderator Test User",
      gdg_id: "GDG-MOD-001",
    },
    {
      email: "member@gdgpup.test",
      password: "Test123!@#",
      role: "member",
      display_name: "Member Test User",
      gdg_id: "GDG-MEM-001",
    },
    {
      email: "guest@gdgpup.test",
      password: "Test123!@#",
      role: "guest",
      display_name: "Guest Test User",
      gdg_id: "GDG-GUEST-001",
    },
  ];

  console.log("\nCreating test users and assigning roles...");
  for (const testUser of testUsers) {
    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      });
    if (authError) {
      console.error(`Failed to create auth user ${testUser.email}:`, authError);
      continue;
    }

    // Create user record
    const { data: userData, error: userError } = await supabase
      .from("user")
      .insert({
        id: authData.user!.id,
        email: testUser.email,
        display_name: testUser.display_name,
        gdg_id: testUser.gdg_id,
        status: "active",
      })
      .select()
      .single();
    if (userError) {
      console.error(
        `Failed to create user record for ${testUser.email}:`,
        userError,
      );
      continue;
    }

    // Get role ID
    const { data: role } = await supabase
      .from("user_role")
      .select("id")
      .eq("role_name", testUser.role)
      .single();
    if (!role) {
      console.error(`Role ${testUser.role} not found`);
      continue;
    }

    // Assign role
    const { error: junctionError } = await supabase
      .from("user_role_junction")
      .insert({
        user_id: userData.id,
        role_id: role.id,
      });
    if (junctionError) {
      console.error(
        `Failed to assign role to ${testUser.email}:`,
        junctionError,
      );
      continue;
    }

    console.log(`Created ${testUser.role}: ${testUser.email}`);
  }

  console.log("\nTest Credentials:");
  testUsers.forEach((user) => {
    console.log(`   ${user.role}: ${user.email} / ${user.password}`);
  });
  console.log("\nRBAC seeding and testing completed!\n");
}

seedRBACAndUsers().catch((e) => {
  console.error("RBAC test script failed:", e);
  process.exit(1);
});
