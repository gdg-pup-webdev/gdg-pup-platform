CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "category" "text" NOT NULL,
    "image" "text" NOT NULL,
    "link" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

-- Enable RLS
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access" ON "public"."products"
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated all access" ON "public"."products"
    FOR ALL USING (auth.role() = 'authenticated');
