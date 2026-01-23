import { INITIAL_PERMISSION_MATRIX, RESOURCES } from "./initial-roles.seed";

/**
 * Visualize permissions matrix in console
 */
export function visualizePermissions() {
  console.log("\n RBAC Permission Matrix (Testing Phase)\n");
  console.log("Resource: events");
  console.log("-".repeat(70));
  console.log("Role           | Read  | Write | Update | Delete | Description");
  console.log("-".repeat(70));

  const roleDescriptions = {
    admin: "Full access",
    moderator: "Can manage but not delete",
    member: "Read-only access",
  };

  for (const [roleName, resources] of Object.entries(
    INITIAL_PERMISSION_MATRIX,
  )) {
    const perms = resources.events;
    const read = perms.can_read ? "✅" : "❌";
    const write = perms.can_write ? "✅" : "❌";
    const update = perms.can_update ? "✅" : "❌";
    const deleteP = perms.can_delete ? "✅" : "❌";

    console.log(
      `${roleName.padEnd(13)} | ${read}   | ${write}    | ${update}    | ${deleteP}     | ${roleDescriptions[roleName as keyof typeof roleDescriptions]}`,
    );
  }

  console.log("-".repeat(70));
  console.log("\n");
}

visualizePermissions();
