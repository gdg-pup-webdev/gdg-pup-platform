import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase.types";
import { configs } from "@/configs/configs";

const supabase = createClient<Database>(
  configs.supabaseUrl,
  configs.supabaseKey,
);

/**
 * Create test users for each role
 */
export async function seedTestUsers() {
  console.log("Creating test users...\n");

  const testUsers = [
    {
      email: "admin@gdgpup.test",
      password: "Test123!@#",
      role: "admin",
      display_name: "Admin Test User",
      gdg_id: "GDG-ADMIN-001",
    },
    {
      email: "moderator@gdgpup.test",
      password: "Test123!@#",
      role: "moderator",
      display_name: "Moderator Test User",
      gdg_id: "GDG-MOD-001",
    },
    {
      email: "cadet@gdgpup.test",
      password: "Test123!@#",
      role: "member",
      display_name: "Member test User",
      gdg_id: "GDG-MEM-001",
    },
  ];

  try {
    for (const testUser of testUsers) {
      // Create auth user
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
        });

      if (authError) {
        console.error(
          ` Failed to create auth user ${testUser.email}:`,
          authError,
        );
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

    console.log("\n Test users created successfully!");
    console.log("\n Test Credentials:");
    testUsers.forEach((user) => {
      console.log(`   ${user.role}: ${user.email} / ${user.password}`);
    });
  } catch (e) {
    console.error("Test user seeding failed:", e);
    process.exit(1);
  }
}

seedTestUsers();
