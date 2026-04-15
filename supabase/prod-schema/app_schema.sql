SET statement_timeout = 0;

SET lock_timeout = 0;

SET idle_in_transaction_session_timeout = 0;

SET client_encoding = 'UTF8';

SET standard_conforming_strings = on;

SELECT pg_catalog.set_config('search_path', 'public,extensions', false);

SET check_function_bodies = false;

SET xmloption = content;

SET client_min_messages = warning;

SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "extensions";

CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE TYPE "public"."nfc_card_status" AS ENUM (
    'issued',
    'activated',
    'suspended',
    'revoked'
);

ALTER TYPE "public"."nfc_card_status" OWNER TO "postgres";

CREATE TYPE "public"."sparkmates_source" AS ENUM (
    'nfc_card',
    'qr_code',
    'direct_link'
);

ALTER TYPE "public"."sparkmates_source" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."auto_create_app_event"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Insert into the existing public.event table
  INSERT INTO public.event (gdg_event_id, title, description, start_date, end_date, venue)
  VALUES (NEW.gdg_id, NEW.title, NEW.description_short, NEW.start_date, NEW.end_date, NEW.location)
  ON CONFLICT (gdg_event_id) 
  DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    venue = EXCLUDED.venue
  WHERE public.event.gdg_event_id IS NOT NULL; -- update to keep in sync optionally, if manually updated do not

  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."auto_create_app_event"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_sparkmates_analytics"("p_gdg_id" "text") RETURNS TABLE("source" "public"."sparkmates_source", "scan_count" bigint)
    LANGUAGE "sql" STABLE
    AS $$
  select source, count(*)::bigint as scan_count
  from public.sparkmates_metric_events
  where gdg_id = p_gdg_id
  group by source
  order by scan_count desc;
$$;

ALTER FUNCTION "public"."get_sparkmates_analytics"("p_gdg_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- 1. Create Public User Record
  INSERT INTO public.user (id, email, avatar_url, display_name, gdg_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'gdg_id', NULL)
  );

  -- 2. Create Economy Wallet
  INSERT INTO public.wallet (user_id, balance)
  VALUES (
    NEW.id,
    0
  );

  -- 3. Create User Profile
  INSERT INTO public.user_profile (user_id)
  VALUES (
    NEW.id
  );

  -- 4. Assign Default Role
  -- We select the role ID dynamically to be safe
  INSERT INTO public.user_role_junction (user_id, role_id)
  SELECT NEW.id, id 
  FROM public.user_role 
  WHERE name = 'member';
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW; -- Don't block user creation even if this fails
END;$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_nfc_cards_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;

ALTER FUNCTION "public"."set_nfc_cards_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."gdg_members" (
    "gdg_id" "text" NOT NULL,
    "email" "extensions"."citext" NOT NULL,
    "program" "text",
    "department" "text",
    "display_name" "text",
    "first_name" "text",
    "last_name" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "suffix" "text",
    "bio" "text",
    "year_level" smallint,
    "skills_summary" "text",
    "linkedin_url" "text",
    "github_url" "text",
    "portfolio_url" "text",
    "is_public" boolean,
    "membership_type" "text",
    "other_links" "text",
    "technical_skills" "text",
    "learning_interests" "text",
    "tools_and_technologies" "text",
    "nickname" "text",
    "avatar_image_url" "text",
    "middle_name" "text"
);

ALTER TABLE "public"."gdg_members" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."verify_member"("search_term" "text") RETURNS SETOF "public"."gdg_members"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return query
  select *
  from gdg_members m
  where (m.email = search_term::citext or m.gdg_id = search_term)
  limit 1;
end;
$$;

ALTER FUNCTION "public"."verify_member"("search_term" "text") OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."article" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "published_at" timestamp with time zone,
    "is_published" boolean DEFAULT false NOT NULL,
    "author_id" "text",
    "title" "text" NOT NULL,
    "content" "text",
    "eventId" "uuid",
    "description" "text",
    "thumbnail_url" "text"
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

CREATE TABLE IF NOT EXISTS "public"."dp_download_analytics" (
    "id" bigint NOT NULL,
    "event_slug" "text" NOT NULL,
    "frame_id" "text" NOT NULL,
    "source_path" "text",
    "user_agent" "text",
    "downloaded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."dp_download_analytics" OWNER TO "postgres";

ALTER TABLE "public"."dp_download_analytics" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."dp_download_analytics_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

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
    "attendees_count" bigint DEFAULT '0'::bigint NOT NULL,
    "rsvp" bigint,
    "gdg_event_id" bigint,
    "thumbnail_url" "text",
    "bevy_preview_url" "text",
    "short_description" "text",
    "max_capacity" "text",
    "tags" "text",
    "speakers" "text"[] DEFAULT '{}'::"text"[],
    "type" "text",
    "team_id" "uuid"
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

CREATE TABLE IF NOT EXISTS "public"."event_highlight" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "image_url" "text",
    "author_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL
);

ALTER TABLE "public"."event_highlight" OWNER TO "postgres";

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

CREATE TABLE IF NOT EXISTS "public"."file_record" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "file_name" "text",
    "file_description" "text",
    "file_path" "text",
    "preview_url" "text",
    "storage_ref" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "file_type" "text" DEFAULT ''::"text" NOT NULL,
    "folder_id" "uuid"
);

ALTER TABLE "public"."file_record" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."filesystem_folder" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "parent_id" "uuid",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."filesystem_folder" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."survey_response" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "survey_id" "uuid" NOT NULL,
    "event_id" "uuid" NOT NULL,
    "email" character varying(255) NOT NULL,
    "gdg_id" "text",
    "survey_data" "jsonb" NOT NULL,
    "certificate_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."survey_response" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."flat_survey_data" AS
 SELECT "id",
    "created_at",
    (("survey_data" ->> 'isPUPian'::"text"))::boolean AS "is_pupian",
    (("survey_data" -> 'personalInfo'::"text") ->> 'name'::"text") AS "name",
    (("survey_data" -> 'personalInfo'::"text") ->> 'college'::"text") AS "college",
    (("survey_data" -> 'personalInfo'::"text") ->> 'program'::"text") AS "program",
    (("survey_data" -> 'personalInfo'::"text") ->> 'yearLevel'::"text") AS "year_level",
    (("survey_data" -> 'personalInfo'::"text") ->> 'organization'::"text") AS "organization",
    (((("survey_data" -> 'evaluation'::"text") -> 'ratings'::"text") ->> 'Subject'::"text"))::numeric AS "rating_subject",
    (((("survey_data" -> 'evaluation'::"text") -> 'ratings'::"text") ->> 'Duration'::"text"))::numeric AS "rating_duration",
    (((("survey_data" -> 'evaluation'::"text") -> 'ratings'::"text") ->> 'Schedule'::"text"))::numeric AS "rating_schedule",
    (((("survey_data" -> 'evaluation'::"text") -> 'ratings'::"text") ->> 'Speakers'::"text"))::numeric AS "rating_speakers",
    (((("survey_data" -> 'evaluation'::"text") -> 'ratings'::"text") ->> 'ProgramFlow'::"text"))::numeric AS "rating_program_flow",
    ((("survey_data" -> 'evaluation'::"text") ->> 'overallSatisfaction'::"text"))::numeric AS "overall_satisfaction",
    (("survey_data" -> 'evaluation'::"text") ->> 'suggestions'::"text") AS "suggestions",
    (("survey_data" -> 'evaluation'::"text") ->> 'missingContent'::"text") AS "missing_content",
    (("survey_data" -> 'evaluation'::"text") ->> 'valuableAspects'::"text") AS "valuable_aspects",
    (("survey_data" -> 'evaluation'::"text") ->> 'commentsForSpeakers'::"text") AS "comments_for_speakers",
    (("survey_data" -> 'evaluation'::"text") ->> 'questionsForSpeakers'::"text") AS "questions_for_speakers"
   FROM "public"."survey_response";

ALTER VIEW "public"."flat_survey_data" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."gdg_merch" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "image_url" "text",
    "points_cost" bigint,
    "stock" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."gdg_merch" OWNER TO "postgres";

COMMENT ON TABLE "public"."gdg_merch" IS 'tables for gdg merchandises';

CREATE TABLE IF NOT EXISTS "public"."learning_resource" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "url" "text" NOT NULL,
    "thumbnail_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "team_id" "uuid",
    "event_id" "uuid",
    "tags" "jsonb" DEFAULT '[]'::"jsonb"
);

ALTER TABLE "public"."learning_resource" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."member_projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "startDate" timestamp with time zone,
    "endDate" timestamp with time zone,
    "description" "text",
    "mainImageUrl" "text",
    "secondaryImageUrl" "text",
    "tertiaryImageUrl" "text",
    "memberGdgId" "text",
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp with time zone
);

ALTER TABLE "public"."member_projects" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."member_showcase" (
    "id" "uuid" NOT NULL,
    "thumbnail_url" "text" NOT NULL,
    "title" "text" NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "description" "text" NOT NULL,
    "article_url" "text" NOT NULL,
    "showcased_members" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."member_showcase" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."nfc_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gdg_id" "text" NOT NULL,
    "status" "public"."nfc_card_status" DEFAULT 'issued'::"public"."nfc_card_status" NOT NULL,
    "activated_at" timestamp with time zone,
    "suspended_at" timestamp with time zone,
    "revoked_at" timestamp with time zone,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "destination_url" "text"
);

ALTER TABLE "public"."nfc_cards" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."one_time_pins" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reference" "text" NOT NULL,
    "email" "text" NOT NULL,
    "otp_code" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "is_used" boolean NOT NULL
);

ALTER TABLE "public"."one_time_pins" OWNER TO "postgres";

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

CREATE TABLE IF NOT EXISTS "public"."scraped_gdg_events" (
    "gdg_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description_short" "text",
    "url" "text" NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "location" "text",
    "cover_image_url" "text",
    "status" "text",
    "event_type" "text",
    "last_scraped_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "description" "text",
    "tags" "text"[],
    "total_attendees" integer,
    "total_capacity" integer,
    "attendee_virtual_venue_link" "text",
    "event_type_slug" "text",
    "video_url" "text",
    "is_virtual_event" boolean,
    "image_square_url" "text"
);

ALTER TABLE "public"."scraped_gdg_events" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."sparkmates_metric_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gdg_id" "text" NOT NULL,
    "source" "public"."sparkmates_source" DEFAULT 'direct_link'::"public"."sparkmates_source" NOT NULL,
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."sparkmates_metric_events" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."sparkmates_scan_counts" AS
 SELECT "gdg_id",
    "source",
    "count"(*) AS "scan_count"
   FROM "public"."sparkmates_metric_events"
  GROUP BY "gdg_id", "source";

ALTER VIEW "public"."sparkmates_scan_counts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."survey" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "slug" character varying(255) NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "attendance_code" character varying(50),
    "close_time" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "questions_schema" "jsonb"
);

ALTER TABLE "public"."survey" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."task" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text",
    "description" "text",
    "points_on_completion" bigint,
    "is_completed" boolean,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."task" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."team" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "responsibilities" "text",
    "parent_team_id" "uuid"
);

ALTER TABLE "public"."team" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."team_member" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "team_id" "uuid" NOT NULL
);

ALTER TABLE "public"."team_member" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."test" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."test" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gdg_id" "text",
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
    "image_url" "text"
);

ALTER TABLE "public"."user_certificate" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_credential" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email_address" "text" NOT NULL,
    "username" "text" NOT NULL,
    "password_hash" "text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."user_credential" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_credential_reference_code" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reference_code" "text" NOT NULL,
    "email_address" "text",
    "payload" "jsonb",
    "type" "text",
    "otp_reference" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."user_credential_reference_code" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_portfolio" (
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
    "is_public" boolean DEFAULT true NOT NULL,
    "membership_type" "text",
    "department" "text",
    "other_links" "text"[] DEFAULT '{}'::"text"[],
    "technical_skills" "text"[] DEFAULT '{}'::"text"[],
    "learning_interests" "text"[] DEFAULT '{}'::"text"[],
    "tools_and_technologies" "text"[] DEFAULT '{}'::"text"[],
    "first_name" "text",
    "middle_name" "text",
    "last_name" "text",
    "nickname" "text",
    "avatar_image_url" "text",
    "gdg_id" "text"
);

ALTER TABLE "public"."user_portfolio" OWNER TO "postgres";

COMMENT ON TABLE "public"."user_portfolio" IS 'Professional portfolio layer';

COMMENT ON COLUMN "public"."user_portfolio"."membership_type" IS 'Type of membership (e.g., Core, Member)';

COMMENT ON COLUMN "public"."user_portfolio"."department" IS 'Department the user belongs to';

COMMENT ON COLUMN "public"."user_portfolio"."other_links" IS 'Array of additional social or professional links';

COMMENT ON COLUMN "public"."user_portfolio"."technical_skills" IS 'Array of technical skills';

COMMENT ON COLUMN "public"."user_portfolio"."learning_interests" IS 'Array of topics the user is interested in learning';

COMMENT ON COLUMN "public"."user_portfolio"."tools_and_technologies" IS 'Array of tools and technologies the user uses';

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
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."user_role" OWNER TO "postgres";

COMMENT ON TABLE "public"."user_role" IS 'table of all roles';

CREATE TABLE IF NOT EXISTS "public"."user_role_junction" (
    "role_id" "uuid" NOT NULL,
    "gdg_id" "text" NOT NULL
);

ALTER TABLE "public"."user_role_junction" OWNER TO "postgres";

COMMENT ON TABLE "public"."user_role_junction" IS 'junction that connects users to roles';

CREATE TABLE IF NOT EXISTS "public"."user_role_permission" (
    "role_id" "uuid" NOT NULL,
    "resource" "text" NOT NULL,
    "action" "text" NOT NULL
);

ALTER TABLE "public"."user_role_permission" OWNER TO "postgres";

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
    "balance" bigint NOT NULL,
    "webdev_points" bigint,
    "spark_points" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."wallet" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."wallet_transaction" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_type" "text" NOT NULL,
    "source_id" "text" NOT NULL,
    "amount" bigint DEFAULT '0'::bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "point_type" "text"
);

ALTER TABLE "public"."wallet_transaction" OWNER TO "postgres";

COMMENT ON TABLE "public"."wallet_transaction" IS 'Full audit log for scalability (Games-ready).';

COMMENT ON COLUMN "public"."wallet_transaction"."point_type" IS 'the type of currency used in transaction';

ALTER TABLE ONLY "public"."article_comment"
    ADD CONSTRAINT "article_comment_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."article"
    ADD CONSTRAINT "article_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."dp_download_analytics"
    ADD CONSTRAINT "dp_download_analytics_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "event_gdg_event_id_key" UNIQUE ("gdg_event_id");

ALTER TABLE ONLY "public"."event_highlight"
    ADD CONSTRAINT "event_highlight_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."file_record"
    ADD CONSTRAINT "file_record_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."filesystem_folder"
    ADD CONSTRAINT "filesystem_folder_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."gdg_members"
    ADD CONSTRAINT "gdg_members_gdg_id_key" UNIQUE ("gdg_id");

ALTER TABLE ONLY "public"."gdg_members"
    ADD CONSTRAINT "gdg_members_pkey" PRIMARY KEY ("gdg_id");

ALTER TABLE ONLY "public"."gdg_merch"
    ADD CONSTRAINT "gdg_merch_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."member_projects"
    ADD CONSTRAINT "member_projects_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."member_showcase"
    ADD CONSTRAINT "member_showcase_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."nfc_cards"
    ADD CONSTRAINT "nfc_cards_gdg_id_key" UNIQUE ("gdg_id");

ALTER TABLE ONLY "public"."nfc_cards"
    ADD CONSTRAINT "nfc_cards_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."one_time_pins"
    ADD CONSTRAINT "one_time_pins_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."external_resource"
    ADD CONSTRAINT "resource_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."resource_tag_junction"
    ADD CONSTRAINT "resource_tag_junction_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."resource_tag"
    ADD CONSTRAINT "resource_tag_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."reward"
    ADD CONSTRAINT "reward_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."scraped_gdg_events"
    ADD CONSTRAINT "scraped_gdg_events_pkey" PRIMARY KEY ("gdg_id");

ALTER TABLE ONLY "public"."scraped_gdg_events"
    ADD CONSTRAINT "scraped_gdg_events_url_key" UNIQUE ("url");

ALTER TABLE ONLY "public"."sparkmates_metric_events"
    ADD CONSTRAINT "sparkmates_metric_events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."survey"
    ADD CONSTRAINT "survey_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."survey_response"
    ADD CONSTRAINT "survey_response_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."survey_response"
    ADD CONSTRAINT "survey_response_survey_id_email_key" UNIQUE ("survey_id", "email");

ALTER TABLE ONLY "public"."survey"
    ADD CONSTRAINT "survey_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."task"
    ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."team_member"
    ADD CONSTRAINT "team_member_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."learning_resource"
    ADD CONSTRAINT "team_resource_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."test"
    ADD CONSTRAINT "test_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_achievement"
    ADD CONSTRAINT "user_achievement_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_certificate"
    ADD CONSTRAINT "user_certificate_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_credential"
    ADD CONSTRAINT "user_credential_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_credential_reference_code"
    ADD CONSTRAINT "user_credential_reference_code_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_portfolio"
    ADD CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_project"
    ADD CONSTRAINT "user_project_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_role_junction"
    ADD CONSTRAINT "user_role_junction_pkey" PRIMARY KEY ("role_id", "gdg_id");

ALTER TABLE ONLY "public"."user_role"
    ADD CONSTRAINT "user_role_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."user_role_permission"
    ADD CONSTRAINT "user_role_permission_pkey" PRIMARY KEY ("role_id", "resource", "action");

ALTER TABLE ONLY "public"."user_role"
    ADD CONSTRAINT "user_role_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."wallet"
    ADD CONSTRAINT "wallet_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."wallet_transaction"
    ADD CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id");

CREATE INDEX "idx_dp_download_analytics_downloaded_at" ON "public"."dp_download_analytics" USING "btree" ("downloaded_at" DESC);

CREATE INDEX "idx_dp_download_analytics_event_slug" ON "public"."dp_download_analytics" USING "btree" ("event_slug");

CREATE INDEX "idx_dp_download_analytics_frame_id" ON "public"."dp_download_analytics" USING "btree" ("frame_id");

CREATE INDEX "idx_file_record_created_at" ON "public"."file_record" USING "btree" ("created_at" DESC);

CREATE INDEX "idx_gdg_members_search" ON "public"."gdg_members" USING "btree" ("email", "gdg_id");

CREATE INDEX "idx_nfc_cards_status" ON "public"."nfc_cards" USING "btree" ("status");

CREATE INDEX "idx_response_email" ON "public"."survey_response" USING "btree" ("email");

CREATE INDEX "idx_response_survey_id" ON "public"."survey_response" USING "btree" ("survey_id");

CREATE INDEX "idx_sparkmates_metric_events_created_at" ON "public"."sparkmates_metric_events" USING "btree" ("created_at" DESC);

CREATE INDEX "idx_sparkmates_metric_events_gdg_id" ON "public"."sparkmates_metric_events" USING "btree" ("gdg_id");

CREATE INDEX "idx_sparkmates_metric_events_source" ON "public"."sparkmates_metric_events" USING "btree" ("source");

CREATE INDEX "idx_survey_event_id" ON "public"."survey" USING "btree" ("event_id");

CREATE UNIQUE INDEX "idx_user_gdg_id_unique" ON "public"."user" USING "btree" ("gdg_id") WHERE ("gdg_id" IS NOT NULL);

CREATE OR REPLACE TRIGGER "populate_user_when_signup_success" AFTER INSERT ON "public"."user_credential" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();

CREATE OR REPLACE TRIGGER "trg_nfc_cards_updated_at" BEFORE UPDATE ON "public"."nfc_cards" FOR EACH ROW EXECUTE FUNCTION "public"."set_nfc_cards_updated_at"();

CREATE OR REPLACE TRIGGER "trigger_auto_create_app_event" AFTER INSERT ON "public"."scraped_gdg_events" FOR EACH ROW EXECUTE FUNCTION "public"."auto_create_app_event"();

ALTER TABLE ONLY "public"."article_comment"
    ADD CONSTRAINT "article_comment_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."article_comment"
    ADD CONSTRAINT "article_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_attendance"
    ADD CONSTRAINT "event_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "event_gdg_event_id_fkey" FOREIGN KEY ("gdg_event_id") REFERENCES "public"."scraped_gdg_events"("gdg_id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."event_highlight"
    ADD CONSTRAINT "event_highlight_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event_highlight"
    ADD CONSTRAINT "event_highlight_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "event_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."file_record"
    ADD CONSTRAINT "file_record_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."filesystem_folder"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."filesystem_folder"
    ADD CONSTRAINT "filesystem_folder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."filesystem_folder"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."learning_resource"
    ADD CONSTRAINT "learning_resource_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."learning_resource"
    ADD CONSTRAINT "learning_resource_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."nfc_cards"
    ADD CONSTRAINT "nfc_cards_gdg_id_fkey" FOREIGN KEY ("gdg_id") REFERENCES "public"."gdg_members"("gdg_id") ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;

ALTER TABLE ONLY "public"."resource_tag_junction"
    ADD CONSTRAINT "resource_tag_junction_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."external_resource"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."resource_tag_junction"
    ADD CONSTRAINT "resource_tag_junction_resource_tag_id_fkey" FOREIGN KEY ("resource_tag_id") REFERENCES "public"."resource_tag"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."external_resource"
    ADD CONSTRAINT "resource_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reward"
    ADD CONSTRAINT "reward_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."sparkmates_metric_events"
    ADD CONSTRAINT "sparkmates_metric_events_gdg_id_fkey" FOREIGN KEY ("gdg_id") REFERENCES "public"."gdg_members"("gdg_id") ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;

ALTER TABLE ONLY "public"."survey"
    ADD CONSTRAINT "survey_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."survey_response"
    ADD CONSTRAINT "survey_response_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."survey_response"
    ADD CONSTRAINT "survey_response_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."task"
    ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."team_member"
    ADD CONSTRAINT "team_member_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."team_member"
    ADD CONSTRAINT "team_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_parent_team_id_fkey" FOREIGN KEY ("parent_team_id") REFERENCES "public"."team"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."user_achievement"
    ADD CONSTRAINT "user_achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_certificate"
    ADD CONSTRAINT "user_certificate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_gdg_id_fkey" FOREIGN KEY ("gdg_id") REFERENCES "public"."gdg_members"("gdg_id") ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_project"
    ADD CONSTRAINT "user_project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_role_junction"
    ADD CONSTRAINT "user_role_junction_gdg_id_fkey" FOREIGN KEY ("gdg_id") REFERENCES "public"."gdg_members"("gdg_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_role_junction"
    ADD CONSTRAINT "user_role_junction_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_role"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_role_permission"
    ADD CONSTRAINT "user_role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_role"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."wallet_transaction"
    ADD CONSTRAINT "wallet_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."wallet"
    ADD CONSTRAINT "wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Allow authenticated all access" ON "public"."member_showcase" USING (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Allow public read access" ON "public"."member_showcase" FOR SELECT USING (true);

CREATE POLICY "Allow public read access to basic user info" ON "public"."user" FOR SELECT TO "authenticated", "anon" USING (true);

CREATE POLICY "Allow public read access to events" ON "public"."event" FOR SELECT USING (true);

CREATE POLICY "Allow public read access to public profiles" ON "public"."user_portfolio" FOR SELECT TO "authenticated", "anon" USING (("is_public" = true));

CREATE POLICY "Allow public read access to surveys" ON "public"."survey" FOR SELECT USING (true);

CREATE POLICY "Allow public read access to teams" ON "public"."team" FOR SELECT USING (true);

CREATE POLICY "Allow users to view their own profile" ON "public"."user_portfolio" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable all for everyone" ON "public"."learning_resource" USING (true) WITH CHECK (true);

ALTER TABLE "public"."article" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."article_comment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_anon_and_authenticated_read_write" ON "public"."dp_download_analytics" AS RESTRICTIVE TO "authenticated", "anon" USING (false) WITH CHECK (false);

ALTER TABLE "public"."dp_download_analytics" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event_attendance" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."external_resource" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."file_record" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."gdg_members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."learning_resource" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."member_projects" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."member_showcase" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."nfc_cards" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."one_time_pins" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."resource_tag" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."resource_tag_junction" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reward" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."scraped_gdg_events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sparkmates_metric_events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."survey" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."survey_response" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."task" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."team" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."team_member" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."test" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_achievement" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_certificate" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_credential" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_credential_reference_code" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_portfolio" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_project" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_role" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_role_junction" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_role_permission" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."wallet" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."wallet_transaction" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."auto_create_app_event"() TO "anon";

GRANT ALL ON FUNCTION "public"."auto_create_app_event"() TO "authenticated";

GRANT ALL ON FUNCTION "public"."auto_create_app_event"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_sparkmates_analytics"("p_gdg_id" "text") TO "anon";

GRANT ALL ON FUNCTION "public"."get_sparkmates_analytics"("p_gdg_id" "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."get_sparkmates_analytics"("p_gdg_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_nfc_cards_updated_at"() TO "anon";

GRANT ALL ON FUNCTION "public"."set_nfc_cards_updated_at"() TO "authenticated";

GRANT ALL ON FUNCTION "public"."set_nfc_cards_updated_at"() TO "service_role";

GRANT ALL ON TABLE "public"."gdg_members" TO "anon";

GRANT ALL ON TABLE "public"."gdg_members" TO "authenticated";

GRANT ALL ON TABLE "public"."gdg_members" TO "service_role";

GRANT ALL ON FUNCTION "public"."verify_member"("search_term" "text") TO "anon";

GRANT ALL ON FUNCTION "public"."verify_member"("search_term" "text") TO "authenticated";

GRANT ALL ON FUNCTION "public"."verify_member"("search_term" "text") TO "service_role";

GRANT ALL ON TABLE "public"."article" TO "anon";

GRANT ALL ON TABLE "public"."article" TO "authenticated";

GRANT ALL ON TABLE "public"."article" TO "service_role";

GRANT ALL ON TABLE "public"."article_comment" TO "anon";

GRANT ALL ON TABLE "public"."article_comment" TO "authenticated";

GRANT ALL ON TABLE "public"."article_comment" TO "service_role";

GRANT ALL ON TABLE "public"."dp_download_analytics" TO "anon";

GRANT ALL ON TABLE "public"."dp_download_analytics" TO "authenticated";

GRANT ALL ON TABLE "public"."dp_download_analytics" TO "service_role";

GRANT ALL ON SEQUENCE "public"."dp_download_analytics_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."dp_download_analytics_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."dp_download_analytics_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."event" TO "anon";

GRANT ALL ON TABLE "public"."event" TO "authenticated";

GRANT ALL ON TABLE "public"."event" TO "service_role";

GRANT ALL ON TABLE "public"."event_attendance" TO "anon";

GRANT ALL ON TABLE "public"."event_attendance" TO "authenticated";

GRANT ALL ON TABLE "public"."event_attendance" TO "service_role";

GRANT ALL ON TABLE "public"."event_highlight" TO "anon";

GRANT ALL ON TABLE "public"."event_highlight" TO "authenticated";

GRANT ALL ON TABLE "public"."event_highlight" TO "service_role";

GRANT ALL ON TABLE "public"."external_resource" TO "anon";

GRANT ALL ON TABLE "public"."external_resource" TO "authenticated";

GRANT ALL ON TABLE "public"."external_resource" TO "service_role";

GRANT ALL ON TABLE "public"."file_record" TO "anon";

GRANT ALL ON TABLE "public"."file_record" TO "authenticated";

GRANT ALL ON TABLE "public"."file_record" TO "service_role";

GRANT ALL ON TABLE "public"."filesystem_folder" TO "anon";

GRANT ALL ON TABLE "public"."filesystem_folder" TO "authenticated";

GRANT ALL ON TABLE "public"."filesystem_folder" TO "service_role";

GRANT ALL ON TABLE "public"."survey_response" TO "anon";

GRANT ALL ON TABLE "public"."survey_response" TO "authenticated";

GRANT ALL ON TABLE "public"."survey_response" TO "service_role";

GRANT ALL ON TABLE "public"."flat_survey_data" TO "anon";

GRANT ALL ON TABLE "public"."flat_survey_data" TO "authenticated";

GRANT ALL ON TABLE "public"."flat_survey_data" TO "service_role";

GRANT ALL ON TABLE "public"."gdg_merch" TO "anon";

GRANT ALL ON TABLE "public"."gdg_merch" TO "authenticated";

GRANT ALL ON TABLE "public"."gdg_merch" TO "service_role";

GRANT ALL ON TABLE "public"."learning_resource" TO "anon";

GRANT ALL ON TABLE "public"."learning_resource" TO "authenticated";

GRANT ALL ON TABLE "public"."learning_resource" TO "service_role";

GRANT ALL ON TABLE "public"."member_projects" TO "anon";

GRANT ALL ON TABLE "public"."member_projects" TO "authenticated";

GRANT ALL ON TABLE "public"."member_projects" TO "service_role";

GRANT ALL ON TABLE "public"."member_showcase" TO "anon";

GRANT ALL ON TABLE "public"."member_showcase" TO "authenticated";

GRANT ALL ON TABLE "public"."member_showcase" TO "service_role";

GRANT ALL ON TABLE "public"."nfc_cards" TO "anon";

GRANT ALL ON TABLE "public"."nfc_cards" TO "authenticated";

GRANT ALL ON TABLE "public"."nfc_cards" TO "service_role";

GRANT ALL ON TABLE "public"."one_time_pins" TO "anon";

GRANT ALL ON TABLE "public"."one_time_pins" TO "authenticated";

GRANT ALL ON TABLE "public"."one_time_pins" TO "service_role";

GRANT ALL ON TABLE "public"."resource_tag" TO "anon";

GRANT ALL ON TABLE "public"."resource_tag" TO "authenticated";

GRANT ALL ON TABLE "public"."resource_tag" TO "service_role";

GRANT ALL ON TABLE "public"."resource_tag_junction" TO "anon";

GRANT ALL ON TABLE "public"."resource_tag_junction" TO "authenticated";

GRANT ALL ON TABLE "public"."resource_tag_junction" TO "service_role";

GRANT ALL ON TABLE "public"."reward" TO "anon";

GRANT ALL ON TABLE "public"."reward" TO "authenticated";

GRANT ALL ON TABLE "public"."reward" TO "service_role";

GRANT ALL ON TABLE "public"."scraped_gdg_events" TO "anon";

GRANT ALL ON TABLE "public"."scraped_gdg_events" TO "authenticated";

GRANT ALL ON TABLE "public"."scraped_gdg_events" TO "service_role";

GRANT ALL ON TABLE "public"."sparkmates_metric_events" TO "anon";

GRANT ALL ON TABLE "public"."sparkmates_metric_events" TO "authenticated";

GRANT ALL ON TABLE "public"."sparkmates_metric_events" TO "service_role";

GRANT ALL ON TABLE "public"."sparkmates_scan_counts" TO "anon";

GRANT ALL ON TABLE "public"."sparkmates_scan_counts" TO "authenticated";

GRANT ALL ON TABLE "public"."sparkmates_scan_counts" TO "service_role";

GRANT ALL ON TABLE "public"."survey" TO "anon";

GRANT ALL ON TABLE "public"."survey" TO "authenticated";

GRANT ALL ON TABLE "public"."survey" TO "service_role";

GRANT ALL ON TABLE "public"."task" TO "anon";

GRANT ALL ON TABLE "public"."task" TO "authenticated";

GRANT ALL ON TABLE "public"."task" TO "service_role";

GRANT ALL ON TABLE "public"."team" TO "anon";

GRANT ALL ON TABLE "public"."team" TO "authenticated";

GRANT ALL ON TABLE "public"."team" TO "service_role";

GRANT ALL ON TABLE "public"."team_member" TO "anon";

GRANT ALL ON TABLE "public"."team_member" TO "authenticated";

GRANT ALL ON TABLE "public"."team_member" TO "service_role";

GRANT ALL ON TABLE "public"."test" TO "anon";

GRANT ALL ON TABLE "public"."test" TO "authenticated";

GRANT ALL ON TABLE "public"."test" TO "service_role";

GRANT ALL ON TABLE "public"."user" TO "anon";

GRANT ALL ON TABLE "public"."user" TO "authenticated";

GRANT ALL ON TABLE "public"."user" TO "service_role";

GRANT ALL ON TABLE "public"."user_achievement" TO "anon";

GRANT ALL ON TABLE "public"."user_achievement" TO "authenticated";

GRANT ALL ON TABLE "public"."user_achievement" TO "service_role";

GRANT ALL ON TABLE "public"."user_certificate" TO "anon";

GRANT ALL ON TABLE "public"."user_certificate" TO "authenticated";

GRANT ALL ON TABLE "public"."user_certificate" TO "service_role";

GRANT ALL ON TABLE "public"."user_credential" TO "anon";

GRANT ALL ON TABLE "public"."user_credential" TO "authenticated";

GRANT ALL ON TABLE "public"."user_credential" TO "service_role";

GRANT ALL ON TABLE "public"."user_credential_reference_code" TO "anon";

GRANT ALL ON TABLE "public"."user_credential_reference_code" TO "authenticated";

GRANT ALL ON TABLE "public"."user_credential_reference_code" TO "service_role";

GRANT ALL ON TABLE "public"."user_portfolio" TO "anon";

GRANT ALL ON TABLE "public"."user_portfolio" TO "authenticated";

GRANT ALL ON TABLE "public"."user_portfolio" TO "service_role";

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
