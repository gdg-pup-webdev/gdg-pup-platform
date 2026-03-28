CREATE TABLE IF NOT EXISTS "public"."member_showcase" (
    "id" "uuid" PRIMARY KEY,
    "thumbnail_url" "text" NOT NULL,
    "title" "text" NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "description" "text" NOT NULL,
    "article_url" "text" NOT NULL,
    "showcased_members" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

-- Enable RLS
ALTER TABLE "public"."member_showcase" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access" ON "public"."member_showcase"
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated all access" ON "public"."member_showcase"
    FOR ALL USING (auth.role() = 'authenticated');
