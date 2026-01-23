import {
  publicUserInsertSchema,
  publicUserRowSchema,
  publicUserUpdateSchema,
} from "#types/supabase.schema.js";
import { z } from "zod";
import { row as profileRow } from "./profile.js";
import {
  achievement,
  certificate,
  project,
  settings,
} from "../userResourceSystem";
import { wallet } from "../economySystem";

export const row = publicUserRowSchema;

export const insertDTO = publicUserInsertSchema.extend({
  email: z.string().email(),
  display_name: z.string().min(2).max(50),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

export const updateDTO = publicUserUpdateSchema.extend({
  email: z.string().email().optional(),
  display_name: z.string().min(2).max(50).optional(),
  avatar_url: z.string().url().optional().nullable(),
});

export const aggregate = row.extend({
  profiles: profileRow.array(),
  projects: project.row.array(),
  wallets: wallet.row.array(),
  achievements: achievement.row.array(),
  certificates: certificate.row.array(),
  settings: settings.row.array(),
});
