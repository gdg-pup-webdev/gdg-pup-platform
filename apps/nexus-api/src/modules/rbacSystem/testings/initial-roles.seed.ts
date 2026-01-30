import { Tables, TablesInsert } from "@/types/supabase.types.js";

export type UserRole = Tables<"user_role">;
export type UserRoleInsert = TablesInsert<"user_role">;

export const INITIAL_ROLES: UserRoleInsert[] = [
  { role_name: "moderator", description: "Support members" },
  { role_name: "member", description: "Regular users" },
  { role_name: "guest", description: "Guest users" },
];
