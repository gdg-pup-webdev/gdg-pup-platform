


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  INSERT INTO public.user (id, email, avatar_url, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    -- Extract the 'avatar_url' key from the JSON metadata
    NEW.raw_user_meta_data ->> 'avatar_url',
    -- might as well grab the name while we are at it
    NEW.raw_user_meta_data ->> 'full_name'
  );

  INSERT INTO public.wallet (user_id, balance)
  VALUES (
    NEW.id,
    0
  );

  INSERT INTO public.user_profile (user_id)
  VALUES (
    NEW.id
  );

  INSERT INTO public.user_role_junction (user_id, role_id)
  VALUES (
    NEW.id,
    '0c1225c2-31fd-4cf8-acf5-24e408896985'::uuid
  );
 
  
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."article" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "published_at" timestamp with time zone,
    "is_published" boolean DEFAULT false NOT NULL,
    "author_id" "uuid",
    "title" "text" NOT NULL,
    "body" "text",
    "related_event_id" "uuid"
);


ALTER TABLE "public"."article" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."article_comment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "article_id" "uuid",
    "user_id" "uuid",
    "body" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."article_comment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "creator_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "venue" "text",
    "attendance_points" bigint DEFAULT '0'::bigint NOT NULL,
    "attendees_count" bigint DEFAULT '0'::bigint NOT NULL
);


ALTER TABLE "public"."event" OWNER TO "postgres";


COMMENT ON TABLE "public"."event" IS 'All GDG activities';



CREATE TABLE IF NOT EXISTS "public"."event_attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "is_present" boolean DEFAULT false NOT NULL,
    "checkin_method" "text" NOT NULL
);


ALTER TABLE "public"."event_attendance" OWNER TO "postgres";


COMMENT ON TABLE "public"."event_attendance" IS 'Engagement bridge (Leaderboard trigger)';



CREATE TABLE IF NOT EXISTS "public"."external_resource" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "resource_url" "text" NOT NULL,
    "uploader_id" "uuid" NOT NULL
);


ALTER TABLE "public"."external_resource" OWNER TO "postgres";


COMMENT ON TABLE "public"."external_resource" IS 'Study Jam materials.';



CREATE TABLE IF NOT EXISTS "public"."nfc_card" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "status" "text" DEFAULT 'READY'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "activated_at" timestamp with time zone,
    CONSTRAINT "nfc_card_status_check" CHECK (("status" = ANY (ARRAY['READY'::"text", 'ACTIVE'::"text", 'LOST'::"text", 'DISABLED'::"text"])))
);


ALTER TABLE "public"."nfc_card" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nfc_card_transaction" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "card_id" "uuid" NOT NULL,
    "event_type" "text" NOT NULL,
    "scanner_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "nfc_card_transaction_event_type_check" CHECK (("event_type" = ANY (ARRAY['TAP_PROFILE'::"text", 'TAP_CHECKIN'::"text", 'ACTIVATION'::"text"])))
);


ALTER TABLE "public"."nfc_card_transaction" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resource_tag" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tag_name" "text" NOT NULL
);


ALTER TABLE "public"."resource_tag" OWNER TO "postgres";


COMMENT ON TABLE "public"."resource_tag" IS 'Resource categorization.';



CREATE TABLE IF NOT EXISTS "public"."resource_tag_junction" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "resource_tag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."resource_tag_junction" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reward" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "value" bigint NOT NULL,
    "is_claimed" boolean DEFAULT false NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."reward" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."study_jam" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "recording_url" "text" NOT NULL,
    "summary" "text" NOT NULL
);


ALTER TABLE "public"."study_jam" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."team" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_member" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "team_id" "uuid" NOT NULL
);


ALTER TABLE "public"."team_member" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gdg_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "avatar_url" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL
);


ALTER TABLE "public"."user" OWNER TO "postgres";


COMMENT ON TABLE "public"."user" IS 'Core identity table for all platform users.';



CREATE TABLE IF NOT EXISTS "public"."user_achievement" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "achieved_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_achievement" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_certificate" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text" NOT NULL
);


ALTER TABLE "public"."user_certificate" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profile" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "bio" "text",
    "program" "text",
    "year_level" smallint,
    "skills_summary" "text",
    "linkedin_url" "text",
    "github_url" "text",
    "portfolio_url" "text",
    "is_public" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."user_profile" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_profile" IS 'Professional portfolio layer';



CREATE TABLE IF NOT EXISTS "public"."user_project" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "tech_stack" "text",
    "repo_url" "text",
    "demo_url" "text"
);


ALTER TABLE "public"."user_project" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_role" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role_name" "text" NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."user_role" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_role" IS 'table of all roles';



CREATE TABLE IF NOT EXISTS "public"."user_role_junction" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL
);


ALTER TABLE "public"."user_role_junction" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_role_permission" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_role_id" "uuid" NOT NULL,
    "resource_name" "text" NOT NULL,
    "can_read" boolean NOT NULL,
    "can_write" boolean NOT NULL,
    "can_update" boolean NOT NULL,
    "can_delete" boolean NOT NULL
);


ALTER TABLE "public"."user_role_permission" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_role_permission" IS 'defines resources accessible to a role';



CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "color_theme" boolean NOT NULL
);


ALTER TABLE "public"."user_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallet" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "balance" bigint NOT NULL
);


ALTER TABLE "public"."wallet" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallet_transaction" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_type" "text" NOT NULL,
    "source_id" "text" NOT NULL,
    "amount" bigint DEFAULT '0'::bigint NOT NULL,
    "wallet_id" "uuid" NOT NULL
);


ALTER TABLE "public"."wallet_transaction" OWNER TO "postgres";


COMMENT ON TABLE "public"."wallet_transaction" IS 'Full audit log for scalability (Games-ready).';



ALTER TABLE ONLY "public"."article_comment"
    ADD CONSTRAINT "article_comment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nfc_card"
    ADD CONSTRAINT "nfc_card_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nfc_card_transaction"
    ADD CONSTRAINT "nfc_card_transaction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."external_resource"
    ADD CONSTRAINT "resource_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resource_tag_junction"
    ADD CONSTRAINT "resource_tag_junction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resource_tag"
    ADD CONSTRAINT "resource_tag_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reward"
    ADD CONSTRAINT "reward_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_role"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."study_jam"
    ADD CONSTRAINT "study_jam_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_member"
    ADD CONSTRAINT "team_member_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievement"
    ADD CONSTRAINT "user_achievement_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_certificate"
    ADD CONSTRAINT "user_certificate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profile"
    ADD CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_project"
    ADD CONSTRAINT "user_project_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_role_junction"
    ADD CONSTRAINT "user_role_junction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_role_permission"
    ADD CONSTRAINT "user_role_permission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_role"
    ADD CONSTRAINT "user_role_role_name_key" UNIQUE ("role_name");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallet"
    ADD CONSTRAINT "wallet_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallet_transaction"
    ADD CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."article_comment"
    ADD CONSTRAINT "article_comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."article_comment"
    ADD CONSTRAINT "article_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_related_event_id_fkey" FOREIGN KEY ("related_event_id") REFERENCES "public"."event"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."nfc_card_transaction"
    ADD CONSTRAINT "nfc_card_transaction_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."nfc_card"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."nfc_card_transaction"
    ADD CONSTRAINT "nfc_card_transaction_scanner_id_fkey" FOREIGN KEY ("scanner_id") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."nfc_card"
    ADD CONSTRAINT "nfc_card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."resource_tag_junction"
    ADD CONSTRAINT "resource_tag_junction_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."external_resource"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resource_tag_junction"
    ADD CONSTRAINT "resource_tag_junction_resource_tag_id_fkey" FOREIGN KEY ("resource_tag_id") REFERENCES "public"."resource_tag"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."external_resource"
    ADD CONSTRAINT "resource_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reward"
    ADD CONSTRAINT "reward_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_member"
    ADD CONSTRAINT "team_member_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_member"
    ADD CONSTRAINT "team_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_achievement"
    ADD CONSTRAINT "user_achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_certificate"
    ADD CONSTRAINT "user_certificate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile"
    ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_project"
    ADD CONSTRAINT "user_project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_role_junction"
    ADD CONSTRAINT "user_role_junction_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_role"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_role_junction"
    ADD CONSTRAINT "user_role_junction_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_role_permission"
    ADD CONSTRAINT "user_role_permission_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "public"."user_role"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet_transaction"
    ADD CONSTRAINT "wallet_transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet"
    ADD CONSTRAINT "wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Service Role Full Access" ON "public"."nfc_card" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Service Role Full Access Transactions" ON "public"."nfc_card_transaction" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Users can view own card" ON "public"."nfc_card" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."article" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."article_comment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."event_attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."external_resource" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nfc_card" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nfc_card_transaction" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resource_tag" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resource_tag_junction" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reward" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."study_jam" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_member" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_achievement" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_certificate" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profile" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_project" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_role" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_role_junction" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_role_permission" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wallet" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wallet_transaction" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."article" TO "anon";
GRANT ALL ON TABLE "public"."article" TO "authenticated";
GRANT ALL ON TABLE "public"."article" TO "service_role";



GRANT ALL ON TABLE "public"."article_comment" TO "anon";
GRANT ALL ON TABLE "public"."article_comment" TO "authenticated";
GRANT ALL ON TABLE "public"."article_comment" TO "service_role";



GRANT ALL ON TABLE "public"."event" TO "anon";
GRANT ALL ON TABLE "public"."event" TO "authenticated";
GRANT ALL ON TABLE "public"."event" TO "service_role";



GRANT ALL ON TABLE "public"."event_attendance" TO "anon";
GRANT ALL ON TABLE "public"."event_attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."event_attendance" TO "service_role";



GRANT ALL ON TABLE "public"."external_resource" TO "anon";
GRANT ALL ON TABLE "public"."external_resource" TO "authenticated";
GRANT ALL ON TABLE "public"."external_resource" TO "service_role";



GRANT ALL ON TABLE "public"."nfc_card" TO "anon";
GRANT ALL ON TABLE "public"."nfc_card" TO "authenticated";
GRANT ALL ON TABLE "public"."nfc_card" TO "service_role";



GRANT ALL ON TABLE "public"."nfc_card_transaction" TO "anon";
GRANT ALL ON TABLE "public"."nfc_card_transaction" TO "authenticated";
GRANT ALL ON TABLE "public"."nfc_card_transaction" TO "service_role";



GRANT ALL ON TABLE "public"."resource_tag" TO "anon";
GRANT ALL ON TABLE "public"."resource_tag" TO "authenticated";
GRANT ALL ON TABLE "public"."resource_tag" TO "service_role";



GRANT ALL ON TABLE "public"."resource_tag_junction" TO "anon";
GRANT ALL ON TABLE "public"."resource_tag_junction" TO "authenticated";
GRANT ALL ON TABLE "public"."resource_tag_junction" TO "service_role";



GRANT ALL ON TABLE "public"."reward" TO "anon";
GRANT ALL ON TABLE "public"."reward" TO "authenticated";
GRANT ALL ON TABLE "public"."reward" TO "service_role";



GRANT ALL ON TABLE "public"."study_jam" TO "anon";
GRANT ALL ON TABLE "public"."study_jam" TO "authenticated";
GRANT ALL ON TABLE "public"."study_jam" TO "service_role";



GRANT ALL ON TABLE "public"."team" TO "anon";
GRANT ALL ON TABLE "public"."team" TO "authenticated";
GRANT ALL ON TABLE "public"."team" TO "service_role";



GRANT ALL ON TABLE "public"."team_member" TO "anon";
GRANT ALL ON TABLE "public"."team_member" TO "authenticated";
GRANT ALL ON TABLE "public"."team_member" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";



GRANT ALL ON TABLE "public"."user_achievement" TO "anon";
GRANT ALL ON TABLE "public"."user_achievement" TO "authenticated";
GRANT ALL ON TABLE "public"."user_achievement" TO "service_role";



GRANT ALL ON TABLE "public"."user_certificate" TO "anon";
GRANT ALL ON TABLE "public"."user_certificate" TO "authenticated";
GRANT ALL ON TABLE "public"."user_certificate" TO "service_role";



GRANT ALL ON TABLE "public"."user_profile" TO "anon";
GRANT ALL ON TABLE "public"."user_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profile" TO "service_role";



GRANT ALL ON TABLE "public"."user_project" TO "anon";
GRANT ALL ON TABLE "public"."user_project" TO "authenticated";
GRANT ALL ON TABLE "public"."user_project" TO "service_role";



GRANT ALL ON TABLE "public"."user_role" TO "anon";
GRANT ALL ON TABLE "public"."user_role" TO "authenticated";
GRANT ALL ON TABLE "public"."user_role" TO "service_role";



GRANT ALL ON TABLE "public"."user_role_junction" TO "anon";
GRANT ALL ON TABLE "public"."user_role_junction" TO "authenticated";
GRANT ALL ON TABLE "public"."user_role_junction" TO "service_role";



GRANT ALL ON TABLE "public"."user_role_permission" TO "anon";
GRANT ALL ON TABLE "public"."user_role_permission" TO "authenticated";
GRANT ALL ON TABLE "public"."user_role_permission" TO "service_role";



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";



GRANT ALL ON TABLE "public"."wallet" TO "anon";
GRANT ALL ON TABLE "public"."wallet" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet" TO "service_role";



GRANT ALL ON TABLE "public"."wallet_transaction" TO "anon";
GRANT ALL ON TABLE "public"."wallet_transaction" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet_transaction" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER on_new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


