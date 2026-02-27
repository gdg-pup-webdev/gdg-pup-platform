/**
 * @file certificate.ts
 * @description Zod model definitions for User Certificates.
 */

import {
  publicUserCertificateInsertSchema,
  publicUserCertificateRowSchema,
  publicUserCertificateUpdateSchema,
} from "#types/supabase.schema.js";

/** Represents a full certificate record from the database. */
export const row = publicUserCertificateRowSchema;

/** Data Transfer Object for creating a new certificate. */
export const insertDTO = publicUserCertificateInsertSchema;

/** Data Transfer Object for updating an existing certificate. */
export const updateDTO = publicUserCertificateUpdateSchema;