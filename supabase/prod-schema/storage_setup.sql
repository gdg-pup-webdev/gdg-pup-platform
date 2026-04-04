CREATE SCHEMA IF NOT EXISTS "storage";

CREATE POLICY "Allow Public Read Access" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'certificates'::"text"));

CREATE POLICY "Allow Service Role Full Access" ON "storage"."objects" TO "service_role" USING (("bucket_id" = 'certificates'::"text"));

CREATE POLICY "Authenticated Delete Access" ON "storage"."objects" FOR DELETE TO "authenticated" USING (("bucket_id" = 'public'::"text"));

CREATE POLICY "Authenticated Upload Access" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK (("bucket_id" = 'public'::"text"));

CREATE POLICY "Public Read Access" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'public'::"text"));

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."buckets_vectors" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "storage"."vector_indexes" ENABLE ROW LEVEL SECURITY;
