<<<<<<< HEAD:apps/nexus-api/src/modules/userSystem/users/user.types.ts
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/presentation/types/supabase.types.js";
=======
import { Tables, TablesInsert, TablesUpdate } from "@/v0/types/supabase.types.js";
>>>>>>> dev:apps/nexus-api/src/v0/modules/userSystem/users/user.types.ts

export type userRow = Tables<"user">;
export type userInsert = TablesInsert<"user">;
export type userUpdate = TablesUpdate<"user">;
