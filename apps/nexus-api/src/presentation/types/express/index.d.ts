import { User } from "@supabase/supabase-js";
import "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { UserRecord } from "firebase-admin/auth";

declare global {
  namespace Express {
    export interface Request {
      // token parser.ts
      supabaseAccessToken?: string | undefined;
      googleAccessToken?: string | undefined;

      // user parser.ts
      user?: User | undefined;
      role?: string | undefined;
    }
  }
}
