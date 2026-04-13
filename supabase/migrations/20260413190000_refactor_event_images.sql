CREATE TABLE IF NOT EXISTS "public"."event_images" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "eventId" uuid NOT NULL REFERENCES "public"."event"("id") ON DELETE CASCADE,
    "imageUrl" text NOT NULL,
    "position" smallint NOT NULL CHECK ("position" >= 0 AND "position" <= 19),
    "createdAt" timestamp with time zone NOT NULL DEFAULT "now"(),
    "updatedAt" timestamp with time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS "event_images_eventId_position_key"
ON "public"."event_images" ("eventId", "position");

CREATE INDEX IF NOT EXISTS "event_images_eventId_idx"
ON "public"."event_images" ("eventId");

INSERT INTO "public"."event_images" ("eventId", "imageUrl", "position")
SELECT "id", "thumbnail_url", 0
FROM "public"."event"
WHERE "thumbnail_url" IS NOT NULL AND btrim("thumbnail_url") <> ''
ON CONFLICT ("eventId", "position")
DO UPDATE SET
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = "now"();

ALTER TABLE "public"."event"
DROP COLUMN IF EXISTS "thumbnail_url";
