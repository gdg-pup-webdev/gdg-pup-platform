import {
  publicUserCertificateInsertSchema,
  publicUserCertificateRowSchema,
  publicUserCertificateUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicUserCertificateRowSchema;

export const insertDTO = publicUserCertificateInsertSchema;

export const updateDTO = publicUserCertificateUpdateSchema;
