import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

export type roleRow = Tables<"user_role">;
export type roleInsert = Omit<TablesInsert<"user_role">, "id">;
export type roleUpdate = Omit<TablesUpdate<"user_role">, "id">;

export type roleWithPermission = Tables<"user_role"> & {
  user_role_permission: Tables<"user_role_permission">[];
};

export type roleWithPermissionAndUser = roleWithPermission & {
  user_role_junction: Tables<"user_role_junction">[];
}

export type rolePermissionRow = Tables<"user_role_permission">;
export type rolePermissionInsert = {
  resource: string;
  action: string;
};

export type roleFilters = {
  userId?: string | null;
  resource?: string | null;
  action?: string | null;
  roleId?: string | null;
};
