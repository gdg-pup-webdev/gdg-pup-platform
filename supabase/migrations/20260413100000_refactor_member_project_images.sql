CREATE TABLE IF NOT EXISTS "public"."member_project_images" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "memberProjectId" uuid NOT NULL REFERENCES "public"."member_projects"("id") ON DELETE CASCADE,
    "imageUrl" text NOT NULL,
    "position" smallint NOT NULL CHECK ("position" >= 0 AND "position" <= 3),
    "createdAt" timestamp with time zone NOT NULL DEFAULT "now"(),
    "updatedAt" timestamp with time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS "member_project_images_memberProjectId_position_key"
ON "public"."member_project_images" ("memberProjectId", "position");

CREATE INDEX IF NOT EXISTS "member_project_images_memberProjectId_idx"
ON "public"."member_project_images" ("memberProjectId");

INSERT INTO "public"."member_project_images" ("memberProjectId", "imageUrl", "position")
SELECT "id", "mainImageUrl", 0
FROM "public"."member_projects"
WHERE "mainImageUrl" IS NOT NULL AND btrim("mainImageUrl") <> ''
ON CONFLICT ("memberProjectId", "position")
DO UPDATE SET
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = "now"();

INSERT INTO "public"."member_project_images" ("memberProjectId", "imageUrl", "position")
SELECT "id", "secondaryImageUrl", 1
FROM "public"."member_projects"
WHERE "secondaryImageUrl" IS NOT NULL AND btrim("secondaryImageUrl") <> ''
ON CONFLICT ("memberProjectId", "position")
DO UPDATE SET
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = "now"();

INSERT INTO "public"."member_project_images" ("memberProjectId", "imageUrl", "position")
SELECT "id", "tertiaryImageUrl", 2
FROM "public"."member_projects"
WHERE "tertiaryImageUrl" IS NOT NULL AND btrim("tertiaryImageUrl") <> ''
ON CONFLICT ("memberProjectId", "position")
DO UPDATE SET
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = "now"();

ALTER TABLE "public"."member_projects"
DROP COLUMN IF EXISTS "mainImageUrl",
DROP COLUMN IF EXISTS "secondaryImageUrl",
DROP COLUMN IF EXISTS "tertiaryImageUrl";
