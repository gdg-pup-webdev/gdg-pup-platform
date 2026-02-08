import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

export type roleRow = Tables<"user_role">;
export type roleInsert = TablesInsert<"user_role">;
export type roleUpdate = TablesUpdate<"user_role">;

export type roleAggregate = Tables<"user_role"> & {
  user_role_permission: Tables<"user_role_permission">[];
};

export type rolePermissionRow = Tables<"user_role_permission">;
export type rolePermissionInsert = {
  resource: string;
  action: string;
};

export type roleFilters = {
  userId?: string | null;
  resource?: string | null;
  action?: string | null;
};
