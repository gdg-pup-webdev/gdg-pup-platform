import { publicUserRowSchema } from "@/types/supabase.schema.js";
import { Tables } from "@/types/supabase.types.js";
import z from "zod";




export namespace AttendeeModels {
    export const row = publicUserRowSchema;
    export type row = z.infer<typeof row>;
}