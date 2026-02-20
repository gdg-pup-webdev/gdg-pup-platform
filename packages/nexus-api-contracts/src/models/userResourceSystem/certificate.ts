/**
 * @file certificate.ts
 * @description Zod model definitions for User Certificates.
 */

import {
  publicUserCertificateInsertSchema,
  publicUserCertificateRowSchema,
  publicUserCertificateUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

/** Represents a full certificate record from the database. */
export const row = publicUserCertificateRowSchema.extend({
  title: z.string().openapi({
    description: "The name of the certificate or course.",
    example: "Google Cloud Fundamentals",
  }),
  description: z.string().openapi({
    description: "Brief summary of the certification.",
  }),
  image_url: z.string().openapi({
    description: "URL to the digital certificate image or PDF.",
  }),
});

/** Data Transfer Object for creating a new certificate. */
export const insertDTO = publicUserCertificateInsertSchema.extend({
  title: z.string().openapi({ description: "Certificate title" }),
  description: z.string().openapi({ description: "Certificate description" }),
  image_url: z.string().openapi({ description: "URL to the certificate image" }),
  user_id: z.string().openapi({ description: "User ID receiving the certificate" }),
});

/** Data Transfer Object for updating an existing certificate. */
export const updateDTO = publicUserCertificateUpdateSchema.extend({
  title: z.string().optional().openapi({ description: "Update certificate title" }),
  description: z.string().optional().openapi({ description: "Update description" }),
  image_url: z.string().optional().openapi({ description: "Update image URL" }),
});