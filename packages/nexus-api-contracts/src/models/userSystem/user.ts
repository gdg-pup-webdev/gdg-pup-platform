import {
  publicUserInsertSchema,
  publicUserRowSchema,
  publicUserUpdateSchema,
} from "#types/supabase.schema.js";
import { z } from "zod";
import { row as profileRow } from "./profile.js";
import { project } from "../userResourceSystem";
import { wallet } from "../economySystem";

export const row = publicUserRowSchema;

export const insertDTO = publicUserInsertSchema;

export const updateDTO = publicUserUpdateSchema;

export const aggregate = row.extend({ 
  profiles: profileRow.array(),
  projects: project.row.array(),
  wallets: wallet.row.array(),
});
