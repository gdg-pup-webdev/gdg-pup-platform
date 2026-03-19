drop extension if exists "pg_net";

create extension if not exists "citext" with schema "public";

create type "public"."nfc_card_status" as enum ('issued', 'activated', 'suspended', 'revoked');

create type "public"."sparkmates_source" as enum ('nfc_card', 'qr_code', 'direct_link');


  create table "public"."article" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "published_at" timestamp with time zone,
    "is_published" boolean not null default false,
    "author_id" uuid,
    "title" text not null,
    "body" text,
    "related_event_id" uuid
      );


alter table "public"."article" enable row level security;


  create table "public"."article_comment" (
    "id" uuid not null default gen_random_uuid(),
    "article_id" uuid,
    "user_id" uuid,
    "body" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."article_comment" enable row level security;


  create table "public"."event" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "creator_id" uuid,
    "title" text not null,
    "description" text,
    "category" text,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "venue" text,
    "attendance_points" bigint not null default '0'::bigint,
    "attendees_count" bigint not null default '0'::bigint,
    "gdg_event_id" bigint
      );


alter table "public"."event" enable row level security;


  create table "public"."event_attendance" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "event_id" uuid not null,
    "is_present" boolean not null default false,
    "checkin_method" text not null
      );


alter table "public"."event_attendance" enable row level security;


  create table "public"."external_resource" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text,
    "resource_url" text not null,
    "uploader_id" uuid not null
      );


alter table "public"."external_resource" enable row level security;


  create table "public"."file_record" (
    "id" uuid not null default gen_random_uuid(),
    "file_name" text,
    "file_description" text,
    "file_path" text,
    "preview_url" text,
    "storage_ref" text
      );


alter table "public"."file_record" enable row level security;


  create table "public"."gdg_members" (
    "id" uuid not null default gen_random_uuid(),
    "gdg_id" text not null,
    "email" public.citext not null,
    "program" text,
    "department" text,
    "display_name" text,
    "first_name" text,
    "last_name" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now()),
    "suffix" text
      );


alter table "public"."gdg_members" enable row level security;


  create table "public"."nfc_cards" (
    "id" uuid not null default gen_random_uuid(),
    "gdg_id" text not null,
    "owner_user_id" uuid,
    "status" public.nfc_card_status not null default 'issued'::public.nfc_card_status,
    "activated_at" timestamp with time zone,
    "suspended_at" timestamp with time zone,
    "revoked_at" timestamp with time zone,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."nfc_cards" enable row level security;


  create table "public"."resource_tag" (
    "id" uuid not null default gen_random_uuid(),
    "tag_name" text not null
      );


alter table "public"."resource_tag" enable row level security;


  create table "public"."resource_tag_junction" (
    "id" uuid not null default gen_random_uuid(),
    "resource_id" uuid not null,
    "resource_tag_id" uuid not null
      );


alter table "public"."resource_tag_junction" enable row level security;


  create table "public"."reward" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text not null,
    "value" bigint not null,
    "is_claimed" boolean not null default false,
    "user_id" uuid not null
      );


alter table "public"."reward" enable row level security;


  create table "public"."scraped_gdg_events" (
    "gdg_id" bigint not null,
    "title" text not null,
    "description_short" text,
    "url" text not null,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "location" text,
    "cover_image_url" text,
    "status" text,
    "event_type" text,
    "last_scraped_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "description" text,
    "tags" text[],
    "total_attendees" integer,
    "total_capacity" integer,
    "attendee_virtual_venue_link" text,
    "event_type_slug" text,
    "video_url" text,
    "is_virtual_event" boolean
      );


alter table "public"."scraped_gdg_events" enable row level security;


  create table "public"."sparkmates_metric_events" (
    "id" uuid not null default gen_random_uuid(),
    "gdg_id" text not null,
    "source" public.sparkmates_source not null default 'direct_link'::public.sparkmates_source,
    "user_agent" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."sparkmates_metric_events" enable row level security;


  create table "public"."study_jam" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text not null,
    "recording_url" text,
    "summary" text not null,
    "creator_id" text
      );


alter table "public"."study_jam" enable row level security;


  create table "public"."task" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text,
    "description" text,
    "points_on_completion" bigint,
    "is_completed" boolean,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
      );


alter table "public"."task" enable row level security;


  create table "public"."team" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text not null,
    "responsibilities" text,
    "parent_team_id" uuid
      );


alter table "public"."team" enable row level security;


  create table "public"."team_member" (
    "id" uuid not null default gen_random_uuid(),
    "role" text not null,
    "user_id" uuid not null,
    "team_id" uuid not null
      );


alter table "public"."team_member" enable row level security;


  create table "public"."user" (
    "id" uuid not null default gen_random_uuid(),
    "gdg_id" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "email" text not null,
    "display_name" text not null,
    "first_name" text,
    "last_name" text,
    "avatar_url" text,
    "status" text not null default 'active'::text
      );


alter table "public"."user" enable row level security;


  create table "public"."user_achievement" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "description" text,
    "image_url" text,
    "achieved_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_achievement" enable row level security;


  create table "public"."user_certificate" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "image_url" text
      );


alter table "public"."user_certificate" enable row level security;


  create table "public"."user_profile" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "bio" text,
    "program" text,
    "year_level" smallint,
    "skills_summary" text,
    "linkedin_url" text,
    "github_url" text,
    "portfolio_url" text,
    "is_public" boolean not null default true
      );


alter table "public"."user_profile" enable row level security;


  create table "public"."user_project" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text,
    "tech_stack" text,
    "repo_url" text,
    "demo_url" text
      );


alter table "public"."user_project" enable row level security;


  create table "public"."user_role" (
    "name" text not null,
    "description" text not null,
    "id" uuid not null default gen_random_uuid()
      );


alter table "public"."user_role" enable row level security;


  create table "public"."user_role_junction" (
    "role_id" uuid not null,
    "user_id" uuid not null
      );


alter table "public"."user_role_junction" enable row level security;


  create table "public"."user_role_permission" (
    "role_id" uuid not null,
    "resource" text not null,
    "action" text not null
      );


alter table "public"."user_role_permission" enable row level security;


  create table "public"."user_settings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "color_theme" boolean not null
      );


alter table "public"."user_settings" enable row level security;


  create table "public"."wallet" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "balance" bigint not null,
    "webdev_points" bigint,
    "spark_points" bigint not null default '0'::bigint
      );


alter table "public"."wallet" enable row level security;


  create table "public"."wallet_transaction" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "source_type" text not null,
    "source_id" text not null,
    "amount" bigint not null default '0'::bigint,
    "user_id" uuid not null,
    "point_type" text
      );


alter table "public"."wallet_transaction" enable row level security;

CREATE UNIQUE INDEX article_comment_pkey ON public.article_comment USING btree (id);

CREATE UNIQUE INDEX article_pkey ON public.article USING btree (id);

CREATE UNIQUE INDEX event_gdg_event_id_key ON public.event USING btree (gdg_event_id);

CREATE UNIQUE INDEX events_pkey ON public.event USING btree (id);

CREATE UNIQUE INDEX file_record_pkey ON public.file_record USING btree (id);

CREATE UNIQUE INDEX gdg_members_email_key ON public.gdg_members USING btree (email);

CREATE UNIQUE INDEX gdg_members_gdg_id_key ON public.gdg_members USING btree (gdg_id);

CREATE UNIQUE INDEX gdg_members_pkey ON public.gdg_members USING btree (id);

CREATE INDEX idx_gdg_members_search ON public.gdg_members USING btree (email, gdg_id);

CREATE INDEX idx_nfc_cards_owner_user_id ON public.nfc_cards USING btree (owner_user_id);

CREATE INDEX idx_nfc_cards_status ON public.nfc_cards USING btree (status);

CREATE INDEX idx_sparkmates_metric_events_created_at ON public.sparkmates_metric_events USING btree (created_at DESC);

CREATE INDEX idx_sparkmates_metric_events_gdg_id ON public.sparkmates_metric_events USING btree (gdg_id);

CREATE INDEX idx_sparkmates_metric_events_source ON public.sparkmates_metric_events USING btree (source);

CREATE UNIQUE INDEX idx_user_gdg_id_unique ON public."user" USING btree (gdg_id) WHERE (gdg_id IS NOT NULL);

CREATE UNIQUE INDEX nfc_cards_gdg_id_key ON public.nfc_cards USING btree (gdg_id);

CREATE UNIQUE INDEX nfc_cards_pkey ON public.nfc_cards USING btree (id);

CREATE UNIQUE INDEX resource_pkey ON public.external_resource USING btree (id);

CREATE UNIQUE INDEX resource_tag_junction_pkey ON public.resource_tag_junction USING btree (id);

CREATE UNIQUE INDEX resource_tag_pkey ON public.resource_tag USING btree (id);

CREATE UNIQUE INDEX reward_pkey ON public.reward USING btree (id);

CREATE UNIQUE INDEX scraped_gdg_events_pkey ON public.scraped_gdg_events USING btree (gdg_id);

CREATE UNIQUE INDEX scraped_gdg_events_url_key ON public.scraped_gdg_events USING btree (url);

CREATE UNIQUE INDEX sparkmates_metric_events_pkey ON public.sparkmates_metric_events USING btree (id);

CREATE UNIQUE INDEX study_jam_pkey ON public.study_jam USING btree (id);

CREATE UNIQUE INDEX task_pkey ON public.task USING btree (id);

CREATE UNIQUE INDEX team_member_pkey ON public.team_member USING btree (id);

CREATE UNIQUE INDEX team_pkey ON public.team USING btree (id);

CREATE UNIQUE INDEX user_achievement_pkey ON public.user_achievement USING btree (id);

CREATE UNIQUE INDEX user_certificate_pkey ON public.user_certificate USING btree (id);

CREATE UNIQUE INDEX user_pkey ON public."user" USING btree (id);

CREATE UNIQUE INDEX user_profile_pkey ON public.user_profile USING btree (id);

CREATE UNIQUE INDEX user_project_pkey ON public.user_project USING btree (id);

CREATE UNIQUE INDEX user_role_junction_pkey ON public.user_role_junction USING btree (role_id, user_id);

CREATE UNIQUE INDEX user_role_name_key ON public.user_role USING btree (name);

CREATE UNIQUE INDEX user_role_permission_pkey ON public.user_role_permission USING btree (role_id, resource, action);

CREATE UNIQUE INDEX user_role_pkey ON public.user_role USING btree (id);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id);

CREATE UNIQUE INDEX wallet_pkey ON public.wallet USING btree (id);

CREATE UNIQUE INDEX wallet_transaction_pkey ON public.wallet_transaction USING btree (id);

alter table "public"."article" add constraint "article_pkey" PRIMARY KEY using index "article_pkey";

alter table "public"."article_comment" add constraint "article_comment_pkey" PRIMARY KEY using index "article_comment_pkey";

alter table "public"."event" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."external_resource" add constraint "resource_pkey" PRIMARY KEY using index "resource_pkey";

alter table "public"."file_record" add constraint "file_record_pkey" PRIMARY KEY using index "file_record_pkey";

alter table "public"."gdg_members" add constraint "gdg_members_pkey" PRIMARY KEY using index "gdg_members_pkey";

alter table "public"."nfc_cards" add constraint "nfc_cards_pkey" PRIMARY KEY using index "nfc_cards_pkey";

alter table "public"."resource_tag" add constraint "resource_tag_pkey" PRIMARY KEY using index "resource_tag_pkey";

alter table "public"."resource_tag_junction" add constraint "resource_tag_junction_pkey" PRIMARY KEY using index "resource_tag_junction_pkey";

alter table "public"."reward" add constraint "reward_pkey" PRIMARY KEY using index "reward_pkey";

alter table "public"."scraped_gdg_events" add constraint "scraped_gdg_events_pkey" PRIMARY KEY using index "scraped_gdg_events_pkey";

alter table "public"."sparkmates_metric_events" add constraint "sparkmates_metric_events_pkey" PRIMARY KEY using index "sparkmates_metric_events_pkey";

alter table "public"."study_jam" add constraint "study_jam_pkey" PRIMARY KEY using index "study_jam_pkey";

alter table "public"."task" add constraint "task_pkey" PRIMARY KEY using index "task_pkey";

alter table "public"."team" add constraint "team_pkey" PRIMARY KEY using index "team_pkey";

alter table "public"."team_member" add constraint "team_member_pkey" PRIMARY KEY using index "team_member_pkey";

alter table "public"."user" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."user_achievement" add constraint "user_achievement_pkey" PRIMARY KEY using index "user_achievement_pkey";

alter table "public"."user_certificate" add constraint "user_certificate_pkey" PRIMARY KEY using index "user_certificate_pkey";

alter table "public"."user_profile" add constraint "user_profile_pkey" PRIMARY KEY using index "user_profile_pkey";

alter table "public"."user_project" add constraint "user_project_pkey" PRIMARY KEY using index "user_project_pkey";

alter table "public"."user_role" add constraint "user_role_pkey" PRIMARY KEY using index "user_role_pkey";

alter table "public"."user_role_junction" add constraint "user_role_junction_pkey" PRIMARY KEY using index "user_role_junction_pkey";

alter table "public"."user_role_permission" add constraint "user_role_permission_pkey" PRIMARY KEY using index "user_role_permission_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."wallet" add constraint "wallet_pkey" PRIMARY KEY using index "wallet_pkey";

alter table "public"."wallet_transaction" add constraint "wallet_transaction_pkey" PRIMARY KEY using index "wallet_transaction_pkey";

alter table "public"."article" add constraint "article_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."article" validate constraint "article_author_id_fkey";

alter table "public"."article" add constraint "article_related_event_id_fkey" FOREIGN KEY (related_event_id) REFERENCES public.event(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."article" validate constraint "article_related_event_id_fkey";

alter table "public"."article_comment" add constraint "article_comment_article_id_fkey" FOREIGN KEY (article_id) REFERENCES public.article(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."article_comment" validate constraint "article_comment_article_id_fkey";

alter table "public"."article_comment" add constraint "article_comment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."article_comment" validate constraint "article_comment_user_id_fkey";

alter table "public"."event" add constraint "event_gdg_event_id_fkey" FOREIGN KEY (gdg_event_id) REFERENCES public.scraped_gdg_events(gdg_id) ON DELETE SET NULL not valid;

alter table "public"."event" validate constraint "event_gdg_event_id_fkey";

alter table "public"."event" add constraint "event_gdg_event_id_key" UNIQUE using index "event_gdg_event_id_key";

alter table "public"."event" add constraint "events_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event" validate constraint "events_creator_id_fkey";

alter table "public"."event_attendance" add constraint "event_attendance_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.event(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_attendance" validate constraint "event_attendance_event_id_fkey";

alter table "public"."event_attendance" add constraint "event_attendance_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_attendance" validate constraint "event_attendance_user_id_fkey";

alter table "public"."external_resource" add constraint "resource_uploader_id_fkey" FOREIGN KEY (uploader_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."external_resource" validate constraint "resource_uploader_id_fkey";

alter table "public"."gdg_members" add constraint "gdg_members_email_key" UNIQUE using index "gdg_members_email_key";

alter table "public"."gdg_members" add constraint "gdg_members_gdg_id_key" UNIQUE using index "gdg_members_gdg_id_key";

alter table "public"."nfc_cards" add constraint "nfc_cards_gdg_id_fkey" FOREIGN KEY (gdg_id) REFERENCES public.gdg_members(gdg_id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID not valid;

alter table "public"."nfc_cards" validate constraint "nfc_cards_gdg_id_fkey";

alter table "public"."nfc_cards" add constraint "nfc_cards_gdg_id_key" UNIQUE using index "nfc_cards_gdg_id_key";

alter table "public"."nfc_cards" add constraint "nfc_cards_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID not valid;

alter table "public"."nfc_cards" validate constraint "nfc_cards_owner_user_id_fkey";

alter table "public"."resource_tag_junction" add constraint "resource_tag_junction_resource_id_fkey" FOREIGN KEY (resource_id) REFERENCES public.external_resource(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."resource_tag_junction" validate constraint "resource_tag_junction_resource_id_fkey";

alter table "public"."resource_tag_junction" add constraint "resource_tag_junction_resource_tag_id_fkey" FOREIGN KEY (resource_tag_id) REFERENCES public.resource_tag(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."resource_tag_junction" validate constraint "resource_tag_junction_resource_tag_id_fkey";

alter table "public"."reward" add constraint "reward_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."reward" validate constraint "reward_user_id_fkey";

alter table "public"."scraped_gdg_events" add constraint "scraped_gdg_events_url_key" UNIQUE using index "scraped_gdg_events_url_key";

alter table "public"."sparkmates_metric_events" add constraint "sparkmates_metric_events_gdg_id_fkey" FOREIGN KEY (gdg_id) REFERENCES public.gdg_members(gdg_id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID not valid;

alter table "public"."sparkmates_metric_events" validate constraint "sparkmates_metric_events_gdg_id_fkey";

alter table "public"."task" add constraint "task_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."task" validate constraint "task_user_id_fkey";

alter table "public"."team" add constraint "team_parent_team_id_fkey" FOREIGN KEY (parent_team_id) REFERENCES public.team(id) ON DELETE SET NULL not valid;

alter table "public"."team" validate constraint "team_parent_team_id_fkey";

alter table "public"."team_member" add constraint "team_member_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.team(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."team_member" validate constraint "team_member_team_id_fkey";

alter table "public"."team_member" add constraint "team_member_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."team_member" validate constraint "team_member_user_id_fkey";

alter table "public"."user" add constraint "user_gdg_id_fkey" FOREIGN KEY (gdg_id) REFERENCES public.gdg_members(gdg_id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID not valid;

alter table "public"."user" validate constraint "user_gdg_id_fkey";

alter table "public"."user" add constraint "user_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user" validate constraint "user_id_fkey";

alter table "public"."user_achievement" add constraint "user_achievement_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_achievement" validate constraint "user_achievement_user_id_fkey";

alter table "public"."user_certificate" add constraint "user_certificate_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_certificate" validate constraint "user_certificate_user_id_fkey";

alter table "public"."user_profile" add constraint "user_profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_profile" validate constraint "user_profile_user_id_fkey";

alter table "public"."user_project" add constraint "user_project_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_project" validate constraint "user_project_user_id_fkey";

alter table "public"."user_role" add constraint "user_role_name_key" UNIQUE using index "user_role_name_key";

alter table "public"."user_role_junction" add constraint "user_role_junction_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.user_role(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_role_junction" validate constraint "user_role_junction_role_id_fkey";

alter table "public"."user_role_junction" add constraint "user_role_junction_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_role_junction" validate constraint "user_role_junction_user_id_fkey";

alter table "public"."user_role_permission" add constraint "user_role_permission_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.user_role(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_role_permission" validate constraint "user_role_permission_role_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."wallet" add constraint "wallet_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."wallet" validate constraint "wallet_user_id_fkey";

alter table "public"."wallet_transaction" add constraint "wallet_transaction_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."wallet_transaction" validate constraint "wallet_transaction_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_create_app_event()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_sparkmates_analytics(p_gdg_id text)
 RETURNS TABLE(source public.sparkmates_source, scan_count bigint)
 LANGUAGE sql
 STABLE
AS $function$
  select source, count(*)::bigint as scan_count
  from public.sparkmates_metric_events
  where gdg_id = p_gdg_id
  group by source
  order by scan_count desc;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$-- Database function for 'on_new_user' trigger
-- This handles user initialization (public.user, wallet, profile, role)
BEGIN
  -- 1. Create Public User Record
  INSERT INTO public.user (id, email, avatar_url, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
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

  -- 4. Assign Default Role ('member')
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.set_nfc_cards_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

create or replace view "public"."sparkmates_scan_counts" as  SELECT gdg_id,
    source,
    count(*) AS scan_count
   FROM public.sparkmates_metric_events
  GROUP BY gdg_id, source;


CREATE OR REPLACE FUNCTION public.verify_member(search_term text)
 RETURNS SETOF public.gdg_members
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return query
  select *
  from gdg_members m
  where (m.email = search_term::citext or m.gdg_id = search_term)
  limit 1;
end;
$function$
;

grant delete on table "public"."article" to "anon";

grant insert on table "public"."article" to "anon";

grant references on table "public"."article" to "anon";

grant select on table "public"."article" to "anon";

grant trigger on table "public"."article" to "anon";

grant truncate on table "public"."article" to "anon";

grant update on table "public"."article" to "anon";

grant delete on table "public"."article" to "authenticated";

grant insert on table "public"."article" to "authenticated";

grant references on table "public"."article" to "authenticated";

grant select on table "public"."article" to "authenticated";

grant trigger on table "public"."article" to "authenticated";

grant truncate on table "public"."article" to "authenticated";

grant update on table "public"."article" to "authenticated";

grant delete on table "public"."article" to "service_role";

grant insert on table "public"."article" to "service_role";

grant references on table "public"."article" to "service_role";

grant select on table "public"."article" to "service_role";

grant trigger on table "public"."article" to "service_role";

grant truncate on table "public"."article" to "service_role";

grant update on table "public"."article" to "service_role";

grant delete on table "public"."article_comment" to "anon";

grant insert on table "public"."article_comment" to "anon";

grant references on table "public"."article_comment" to "anon";

grant select on table "public"."article_comment" to "anon";

grant trigger on table "public"."article_comment" to "anon";

grant truncate on table "public"."article_comment" to "anon";

grant update on table "public"."article_comment" to "anon";

grant delete on table "public"."article_comment" to "authenticated";

grant insert on table "public"."article_comment" to "authenticated";

grant references on table "public"."article_comment" to "authenticated";

grant select on table "public"."article_comment" to "authenticated";

grant trigger on table "public"."article_comment" to "authenticated";

grant truncate on table "public"."article_comment" to "authenticated";

grant update on table "public"."article_comment" to "authenticated";

grant delete on table "public"."article_comment" to "service_role";

grant insert on table "public"."article_comment" to "service_role";

grant references on table "public"."article_comment" to "service_role";

grant select on table "public"."article_comment" to "service_role";

grant trigger on table "public"."article_comment" to "service_role";

grant truncate on table "public"."article_comment" to "service_role";

grant update on table "public"."article_comment" to "service_role";

grant delete on table "public"."event" to "anon";

grant insert on table "public"."event" to "anon";

grant references on table "public"."event" to "anon";

grant select on table "public"."event" to "anon";

grant trigger on table "public"."event" to "anon";

grant truncate on table "public"."event" to "anon";

grant update on table "public"."event" to "anon";

grant delete on table "public"."event" to "authenticated";

grant insert on table "public"."event" to "authenticated";

grant references on table "public"."event" to "authenticated";

grant select on table "public"."event" to "authenticated";

grant trigger on table "public"."event" to "authenticated";

grant truncate on table "public"."event" to "authenticated";

grant update on table "public"."event" to "authenticated";

grant delete on table "public"."event" to "service_role";

grant insert on table "public"."event" to "service_role";

grant references on table "public"."event" to "service_role";

grant select on table "public"."event" to "service_role";

grant trigger on table "public"."event" to "service_role";

grant truncate on table "public"."event" to "service_role";

grant update on table "public"."event" to "service_role";

grant delete on table "public"."event_attendance" to "anon";

grant insert on table "public"."event_attendance" to "anon";

grant references on table "public"."event_attendance" to "anon";

grant select on table "public"."event_attendance" to "anon";

grant trigger on table "public"."event_attendance" to "anon";

grant truncate on table "public"."event_attendance" to "anon";

grant update on table "public"."event_attendance" to "anon";

grant delete on table "public"."event_attendance" to "authenticated";

grant insert on table "public"."event_attendance" to "authenticated";

grant references on table "public"."event_attendance" to "authenticated";

grant select on table "public"."event_attendance" to "authenticated";

grant trigger on table "public"."event_attendance" to "authenticated";

grant truncate on table "public"."event_attendance" to "authenticated";

grant update on table "public"."event_attendance" to "authenticated";

grant delete on table "public"."event_attendance" to "service_role";

grant insert on table "public"."event_attendance" to "service_role";

grant references on table "public"."event_attendance" to "service_role";

grant select on table "public"."event_attendance" to "service_role";

grant trigger on table "public"."event_attendance" to "service_role";

grant truncate on table "public"."event_attendance" to "service_role";

grant update on table "public"."event_attendance" to "service_role";

grant delete on table "public"."external_resource" to "anon";

grant insert on table "public"."external_resource" to "anon";

grant references on table "public"."external_resource" to "anon";

grant select on table "public"."external_resource" to "anon";

grant trigger on table "public"."external_resource" to "anon";

grant truncate on table "public"."external_resource" to "anon";

grant update on table "public"."external_resource" to "anon";

grant delete on table "public"."external_resource" to "authenticated";

grant insert on table "public"."external_resource" to "authenticated";

grant references on table "public"."external_resource" to "authenticated";

grant select on table "public"."external_resource" to "authenticated";

grant trigger on table "public"."external_resource" to "authenticated";

grant truncate on table "public"."external_resource" to "authenticated";

grant update on table "public"."external_resource" to "authenticated";

grant delete on table "public"."external_resource" to "service_role";

grant insert on table "public"."external_resource" to "service_role";

grant references on table "public"."external_resource" to "service_role";

grant select on table "public"."external_resource" to "service_role";

grant trigger on table "public"."external_resource" to "service_role";

grant truncate on table "public"."external_resource" to "service_role";

grant update on table "public"."external_resource" to "service_role";

grant delete on table "public"."file_record" to "anon";

grant insert on table "public"."file_record" to "anon";

grant references on table "public"."file_record" to "anon";

grant select on table "public"."file_record" to "anon";

grant trigger on table "public"."file_record" to "anon";

grant truncate on table "public"."file_record" to "anon";

grant update on table "public"."file_record" to "anon";

grant delete on table "public"."file_record" to "authenticated";

grant insert on table "public"."file_record" to "authenticated";

grant references on table "public"."file_record" to "authenticated";

grant select on table "public"."file_record" to "authenticated";

grant trigger on table "public"."file_record" to "authenticated";

grant truncate on table "public"."file_record" to "authenticated";

grant update on table "public"."file_record" to "authenticated";

grant delete on table "public"."file_record" to "service_role";

grant insert on table "public"."file_record" to "service_role";

grant references on table "public"."file_record" to "service_role";

grant select on table "public"."file_record" to "service_role";

grant trigger on table "public"."file_record" to "service_role";

grant truncate on table "public"."file_record" to "service_role";

grant update on table "public"."file_record" to "service_role";

grant delete on table "public"."gdg_members" to "anon";

grant insert on table "public"."gdg_members" to "anon";

grant references on table "public"."gdg_members" to "anon";

grant select on table "public"."gdg_members" to "anon";

grant trigger on table "public"."gdg_members" to "anon";

grant truncate on table "public"."gdg_members" to "anon";

grant update on table "public"."gdg_members" to "anon";

grant delete on table "public"."gdg_members" to "authenticated";

grant insert on table "public"."gdg_members" to "authenticated";

grant references on table "public"."gdg_members" to "authenticated";

grant select on table "public"."gdg_members" to "authenticated";

grant trigger on table "public"."gdg_members" to "authenticated";

grant truncate on table "public"."gdg_members" to "authenticated";

grant update on table "public"."gdg_members" to "authenticated";

grant delete on table "public"."gdg_members" to "service_role";

grant insert on table "public"."gdg_members" to "service_role";

grant references on table "public"."gdg_members" to "service_role";

grant select on table "public"."gdg_members" to "service_role";

grant trigger on table "public"."gdg_members" to "service_role";

grant truncate on table "public"."gdg_members" to "service_role";

grant update on table "public"."gdg_members" to "service_role";

grant delete on table "public"."nfc_cards" to "anon";

grant insert on table "public"."nfc_cards" to "anon";

grant references on table "public"."nfc_cards" to "anon";

grant select on table "public"."nfc_cards" to "anon";

grant trigger on table "public"."nfc_cards" to "anon";

grant truncate on table "public"."nfc_cards" to "anon";

grant update on table "public"."nfc_cards" to "anon";

grant delete on table "public"."nfc_cards" to "authenticated";

grant insert on table "public"."nfc_cards" to "authenticated";

grant references on table "public"."nfc_cards" to "authenticated";

grant select on table "public"."nfc_cards" to "authenticated";

grant trigger on table "public"."nfc_cards" to "authenticated";

grant truncate on table "public"."nfc_cards" to "authenticated";

grant update on table "public"."nfc_cards" to "authenticated";

grant delete on table "public"."nfc_cards" to "service_role";

grant insert on table "public"."nfc_cards" to "service_role";

grant references on table "public"."nfc_cards" to "service_role";

grant select on table "public"."nfc_cards" to "service_role";

grant trigger on table "public"."nfc_cards" to "service_role";

grant truncate on table "public"."nfc_cards" to "service_role";

grant update on table "public"."nfc_cards" to "service_role";

grant delete on table "public"."resource_tag" to "anon";

grant insert on table "public"."resource_tag" to "anon";

grant references on table "public"."resource_tag" to "anon";

grant select on table "public"."resource_tag" to "anon";

grant trigger on table "public"."resource_tag" to "anon";

grant truncate on table "public"."resource_tag" to "anon";

grant update on table "public"."resource_tag" to "anon";

grant delete on table "public"."resource_tag" to "authenticated";

grant insert on table "public"."resource_tag" to "authenticated";

grant references on table "public"."resource_tag" to "authenticated";

grant select on table "public"."resource_tag" to "authenticated";

grant trigger on table "public"."resource_tag" to "authenticated";

grant truncate on table "public"."resource_tag" to "authenticated";

grant update on table "public"."resource_tag" to "authenticated";

grant delete on table "public"."resource_tag" to "service_role";

grant insert on table "public"."resource_tag" to "service_role";

grant references on table "public"."resource_tag" to "service_role";

grant select on table "public"."resource_tag" to "service_role";

grant trigger on table "public"."resource_tag" to "service_role";

grant truncate on table "public"."resource_tag" to "service_role";

grant update on table "public"."resource_tag" to "service_role";

grant delete on table "public"."resource_tag_junction" to "anon";

grant insert on table "public"."resource_tag_junction" to "anon";

grant references on table "public"."resource_tag_junction" to "anon";

grant select on table "public"."resource_tag_junction" to "anon";

grant trigger on table "public"."resource_tag_junction" to "anon";

grant truncate on table "public"."resource_tag_junction" to "anon";

grant update on table "public"."resource_tag_junction" to "anon";

grant delete on table "public"."resource_tag_junction" to "authenticated";

grant insert on table "public"."resource_tag_junction" to "authenticated";

grant references on table "public"."resource_tag_junction" to "authenticated";

grant select on table "public"."resource_tag_junction" to "authenticated";

grant trigger on table "public"."resource_tag_junction" to "authenticated";

grant truncate on table "public"."resource_tag_junction" to "authenticated";

grant update on table "public"."resource_tag_junction" to "authenticated";

grant delete on table "public"."resource_tag_junction" to "service_role";

grant insert on table "public"."resource_tag_junction" to "service_role";

grant references on table "public"."resource_tag_junction" to "service_role";

grant select on table "public"."resource_tag_junction" to "service_role";

grant trigger on table "public"."resource_tag_junction" to "service_role";

grant truncate on table "public"."resource_tag_junction" to "service_role";

grant update on table "public"."resource_tag_junction" to "service_role";

grant delete on table "public"."reward" to "anon";

grant insert on table "public"."reward" to "anon";

grant references on table "public"."reward" to "anon";

grant select on table "public"."reward" to "anon";

grant trigger on table "public"."reward" to "anon";

grant truncate on table "public"."reward" to "anon";

grant update on table "public"."reward" to "anon";

grant delete on table "public"."reward" to "authenticated";

grant insert on table "public"."reward" to "authenticated";

grant references on table "public"."reward" to "authenticated";

grant select on table "public"."reward" to "authenticated";

grant trigger on table "public"."reward" to "authenticated";

grant truncate on table "public"."reward" to "authenticated";

grant update on table "public"."reward" to "authenticated";

grant delete on table "public"."reward" to "service_role";

grant insert on table "public"."reward" to "service_role";

grant references on table "public"."reward" to "service_role";

grant select on table "public"."reward" to "service_role";

grant trigger on table "public"."reward" to "service_role";

grant truncate on table "public"."reward" to "service_role";

grant update on table "public"."reward" to "service_role";

grant delete on table "public"."scraped_gdg_events" to "anon";

grant insert on table "public"."scraped_gdg_events" to "anon";

grant references on table "public"."scraped_gdg_events" to "anon";

grant select on table "public"."scraped_gdg_events" to "anon";

grant trigger on table "public"."scraped_gdg_events" to "anon";

grant truncate on table "public"."scraped_gdg_events" to "anon";

grant update on table "public"."scraped_gdg_events" to "anon";

grant delete on table "public"."scraped_gdg_events" to "authenticated";

grant insert on table "public"."scraped_gdg_events" to "authenticated";

grant references on table "public"."scraped_gdg_events" to "authenticated";

grant select on table "public"."scraped_gdg_events" to "authenticated";

grant trigger on table "public"."scraped_gdg_events" to "authenticated";

grant truncate on table "public"."scraped_gdg_events" to "authenticated";

grant update on table "public"."scraped_gdg_events" to "authenticated";

grant delete on table "public"."scraped_gdg_events" to "service_role";

grant insert on table "public"."scraped_gdg_events" to "service_role";

grant references on table "public"."scraped_gdg_events" to "service_role";

grant select on table "public"."scraped_gdg_events" to "service_role";

grant trigger on table "public"."scraped_gdg_events" to "service_role";

grant truncate on table "public"."scraped_gdg_events" to "service_role";

grant update on table "public"."scraped_gdg_events" to "service_role";

grant delete on table "public"."sparkmates_metric_events" to "anon";

grant insert on table "public"."sparkmates_metric_events" to "anon";

grant references on table "public"."sparkmates_metric_events" to "anon";

grant select on table "public"."sparkmates_metric_events" to "anon";

grant trigger on table "public"."sparkmates_metric_events" to "anon";

grant truncate on table "public"."sparkmates_metric_events" to "anon";

grant update on table "public"."sparkmates_metric_events" to "anon";

grant delete on table "public"."sparkmates_metric_events" to "authenticated";

grant insert on table "public"."sparkmates_metric_events" to "authenticated";

grant references on table "public"."sparkmates_metric_events" to "authenticated";

grant select on table "public"."sparkmates_metric_events" to "authenticated";

grant trigger on table "public"."sparkmates_metric_events" to "authenticated";

grant truncate on table "public"."sparkmates_metric_events" to "authenticated";

grant update on table "public"."sparkmates_metric_events" to "authenticated";

grant delete on table "public"."sparkmates_metric_events" to "service_role";

grant insert on table "public"."sparkmates_metric_events" to "service_role";

grant references on table "public"."sparkmates_metric_events" to "service_role";

grant select on table "public"."sparkmates_metric_events" to "service_role";

grant trigger on table "public"."sparkmates_metric_events" to "service_role";

grant truncate on table "public"."sparkmates_metric_events" to "service_role";

grant update on table "public"."sparkmates_metric_events" to "service_role";

grant delete on table "public"."study_jam" to "anon";

grant insert on table "public"."study_jam" to "anon";

grant references on table "public"."study_jam" to "anon";

grant select on table "public"."study_jam" to "anon";

grant trigger on table "public"."study_jam" to "anon";

grant truncate on table "public"."study_jam" to "anon";

grant update on table "public"."study_jam" to "anon";

grant delete on table "public"."study_jam" to "authenticated";

grant insert on table "public"."study_jam" to "authenticated";

grant references on table "public"."study_jam" to "authenticated";

grant select on table "public"."study_jam" to "authenticated";

grant trigger on table "public"."study_jam" to "authenticated";

grant truncate on table "public"."study_jam" to "authenticated";

grant update on table "public"."study_jam" to "authenticated";

grant delete on table "public"."study_jam" to "service_role";

grant insert on table "public"."study_jam" to "service_role";

grant references on table "public"."study_jam" to "service_role";

grant select on table "public"."study_jam" to "service_role";

grant trigger on table "public"."study_jam" to "service_role";

grant truncate on table "public"."study_jam" to "service_role";

grant update on table "public"."study_jam" to "service_role";

grant delete on table "public"."task" to "anon";

grant insert on table "public"."task" to "anon";

grant references on table "public"."task" to "anon";

grant select on table "public"."task" to "anon";

grant trigger on table "public"."task" to "anon";

grant truncate on table "public"."task" to "anon";

grant update on table "public"."task" to "anon";

grant delete on table "public"."task" to "authenticated";

grant insert on table "public"."task" to "authenticated";

grant references on table "public"."task" to "authenticated";

grant select on table "public"."task" to "authenticated";

grant trigger on table "public"."task" to "authenticated";

grant truncate on table "public"."task" to "authenticated";

grant update on table "public"."task" to "authenticated";

grant delete on table "public"."task" to "service_role";

grant insert on table "public"."task" to "service_role";

grant references on table "public"."task" to "service_role";

grant select on table "public"."task" to "service_role";

grant trigger on table "public"."task" to "service_role";

grant truncate on table "public"."task" to "service_role";

grant update on table "public"."task" to "service_role";

grant delete on table "public"."team" to "anon";

grant insert on table "public"."team" to "anon";

grant references on table "public"."team" to "anon";

grant select on table "public"."team" to "anon";

grant trigger on table "public"."team" to "anon";

grant truncate on table "public"."team" to "anon";

grant update on table "public"."team" to "anon";

grant delete on table "public"."team" to "authenticated";

grant insert on table "public"."team" to "authenticated";

grant references on table "public"."team" to "authenticated";

grant select on table "public"."team" to "authenticated";

grant trigger on table "public"."team" to "authenticated";

grant truncate on table "public"."team" to "authenticated";

grant update on table "public"."team" to "authenticated";

grant delete on table "public"."team" to "service_role";

grant insert on table "public"."team" to "service_role";

grant references on table "public"."team" to "service_role";

grant select on table "public"."team" to "service_role";

grant trigger on table "public"."team" to "service_role";

grant truncate on table "public"."team" to "service_role";

grant update on table "public"."team" to "service_role";

grant delete on table "public"."team_member" to "anon";

grant insert on table "public"."team_member" to "anon";

grant references on table "public"."team_member" to "anon";

grant select on table "public"."team_member" to "anon";

grant trigger on table "public"."team_member" to "anon";

grant truncate on table "public"."team_member" to "anon";

grant update on table "public"."team_member" to "anon";

grant delete on table "public"."team_member" to "authenticated";

grant insert on table "public"."team_member" to "authenticated";

grant references on table "public"."team_member" to "authenticated";

grant select on table "public"."team_member" to "authenticated";

grant trigger on table "public"."team_member" to "authenticated";

grant truncate on table "public"."team_member" to "authenticated";

grant update on table "public"."team_member" to "authenticated";

grant delete on table "public"."team_member" to "service_role";

grant insert on table "public"."team_member" to "service_role";

grant references on table "public"."team_member" to "service_role";

grant select on table "public"."team_member" to "service_role";

grant trigger on table "public"."team_member" to "service_role";

grant truncate on table "public"."team_member" to "service_role";

grant update on table "public"."team_member" to "service_role";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";

grant delete on table "public"."user_achievement" to "anon";

grant insert on table "public"."user_achievement" to "anon";

grant references on table "public"."user_achievement" to "anon";

grant select on table "public"."user_achievement" to "anon";

grant trigger on table "public"."user_achievement" to "anon";

grant truncate on table "public"."user_achievement" to "anon";

grant update on table "public"."user_achievement" to "anon";

grant delete on table "public"."user_achievement" to "authenticated";

grant insert on table "public"."user_achievement" to "authenticated";

grant references on table "public"."user_achievement" to "authenticated";

grant select on table "public"."user_achievement" to "authenticated";

grant trigger on table "public"."user_achievement" to "authenticated";

grant truncate on table "public"."user_achievement" to "authenticated";

grant update on table "public"."user_achievement" to "authenticated";

grant delete on table "public"."user_achievement" to "service_role";

grant insert on table "public"."user_achievement" to "service_role";

grant references on table "public"."user_achievement" to "service_role";

grant select on table "public"."user_achievement" to "service_role";

grant trigger on table "public"."user_achievement" to "service_role";

grant truncate on table "public"."user_achievement" to "service_role";

grant update on table "public"."user_achievement" to "service_role";

grant delete on table "public"."user_certificate" to "anon";

grant insert on table "public"."user_certificate" to "anon";

grant references on table "public"."user_certificate" to "anon";

grant select on table "public"."user_certificate" to "anon";

grant trigger on table "public"."user_certificate" to "anon";

grant truncate on table "public"."user_certificate" to "anon";

grant update on table "public"."user_certificate" to "anon";

grant delete on table "public"."user_certificate" to "authenticated";

grant insert on table "public"."user_certificate" to "authenticated";

grant references on table "public"."user_certificate" to "authenticated";

grant select on table "public"."user_certificate" to "authenticated";

grant trigger on table "public"."user_certificate" to "authenticated";

grant truncate on table "public"."user_certificate" to "authenticated";

grant update on table "public"."user_certificate" to "authenticated";

grant delete on table "public"."user_certificate" to "service_role";

grant insert on table "public"."user_certificate" to "service_role";

grant references on table "public"."user_certificate" to "service_role";

grant select on table "public"."user_certificate" to "service_role";

grant trigger on table "public"."user_certificate" to "service_role";

grant truncate on table "public"."user_certificate" to "service_role";

grant update on table "public"."user_certificate" to "service_role";

grant delete on table "public"."user_profile" to "anon";

grant insert on table "public"."user_profile" to "anon";

grant references on table "public"."user_profile" to "anon";

grant select on table "public"."user_profile" to "anon";

grant trigger on table "public"."user_profile" to "anon";

grant truncate on table "public"."user_profile" to "anon";

grant update on table "public"."user_profile" to "anon";

grant delete on table "public"."user_profile" to "authenticated";

grant insert on table "public"."user_profile" to "authenticated";

grant references on table "public"."user_profile" to "authenticated";

grant select on table "public"."user_profile" to "authenticated";

grant trigger on table "public"."user_profile" to "authenticated";

grant truncate on table "public"."user_profile" to "authenticated";

grant update on table "public"."user_profile" to "authenticated";

grant delete on table "public"."user_profile" to "service_role";

grant insert on table "public"."user_profile" to "service_role";

grant references on table "public"."user_profile" to "service_role";

grant select on table "public"."user_profile" to "service_role";

grant trigger on table "public"."user_profile" to "service_role";

grant truncate on table "public"."user_profile" to "service_role";

grant update on table "public"."user_profile" to "service_role";

grant delete on table "public"."user_project" to "anon";

grant insert on table "public"."user_project" to "anon";

grant references on table "public"."user_project" to "anon";

grant select on table "public"."user_project" to "anon";

grant trigger on table "public"."user_project" to "anon";

grant truncate on table "public"."user_project" to "anon";

grant update on table "public"."user_project" to "anon";

grant delete on table "public"."user_project" to "authenticated";

grant insert on table "public"."user_project" to "authenticated";

grant references on table "public"."user_project" to "authenticated";

grant select on table "public"."user_project" to "authenticated";

grant trigger on table "public"."user_project" to "authenticated";

grant truncate on table "public"."user_project" to "authenticated";

grant update on table "public"."user_project" to "authenticated";

grant delete on table "public"."user_project" to "service_role";

grant insert on table "public"."user_project" to "service_role";

grant references on table "public"."user_project" to "service_role";

grant select on table "public"."user_project" to "service_role";

grant trigger on table "public"."user_project" to "service_role";

grant truncate on table "public"."user_project" to "service_role";

grant update on table "public"."user_project" to "service_role";

grant delete on table "public"."user_role" to "anon";

grant insert on table "public"."user_role" to "anon";

grant references on table "public"."user_role" to "anon";

grant select on table "public"."user_role" to "anon";

grant trigger on table "public"."user_role" to "anon";

grant truncate on table "public"."user_role" to "anon";

grant update on table "public"."user_role" to "anon";

grant delete on table "public"."user_role" to "authenticated";

grant insert on table "public"."user_role" to "authenticated";

grant references on table "public"."user_role" to "authenticated";

grant select on table "public"."user_role" to "authenticated";

grant trigger on table "public"."user_role" to "authenticated";

grant truncate on table "public"."user_role" to "authenticated";

grant update on table "public"."user_role" to "authenticated";

grant delete on table "public"."user_role" to "service_role";

grant insert on table "public"."user_role" to "service_role";

grant references on table "public"."user_role" to "service_role";

grant select on table "public"."user_role" to "service_role";

grant trigger on table "public"."user_role" to "service_role";

grant truncate on table "public"."user_role" to "service_role";

grant update on table "public"."user_role" to "service_role";

grant delete on table "public"."user_role_junction" to "anon";

grant insert on table "public"."user_role_junction" to "anon";

grant references on table "public"."user_role_junction" to "anon";

grant select on table "public"."user_role_junction" to "anon";

grant trigger on table "public"."user_role_junction" to "anon";

grant truncate on table "public"."user_role_junction" to "anon";

grant update on table "public"."user_role_junction" to "anon";

grant delete on table "public"."user_role_junction" to "authenticated";

grant insert on table "public"."user_role_junction" to "authenticated";

grant references on table "public"."user_role_junction" to "authenticated";

grant select on table "public"."user_role_junction" to "authenticated";

grant trigger on table "public"."user_role_junction" to "authenticated";

grant truncate on table "public"."user_role_junction" to "authenticated";

grant update on table "public"."user_role_junction" to "authenticated";

grant delete on table "public"."user_role_junction" to "service_role";

grant insert on table "public"."user_role_junction" to "service_role";

grant references on table "public"."user_role_junction" to "service_role";

grant select on table "public"."user_role_junction" to "service_role";

grant trigger on table "public"."user_role_junction" to "service_role";

grant truncate on table "public"."user_role_junction" to "service_role";

grant update on table "public"."user_role_junction" to "service_role";

grant delete on table "public"."user_role_permission" to "anon";

grant insert on table "public"."user_role_permission" to "anon";

grant references on table "public"."user_role_permission" to "anon";

grant select on table "public"."user_role_permission" to "anon";

grant trigger on table "public"."user_role_permission" to "anon";

grant truncate on table "public"."user_role_permission" to "anon";

grant update on table "public"."user_role_permission" to "anon";

grant delete on table "public"."user_role_permission" to "authenticated";

grant insert on table "public"."user_role_permission" to "authenticated";

grant references on table "public"."user_role_permission" to "authenticated";

grant select on table "public"."user_role_permission" to "authenticated";

grant trigger on table "public"."user_role_permission" to "authenticated";

grant truncate on table "public"."user_role_permission" to "authenticated";

grant update on table "public"."user_role_permission" to "authenticated";

grant delete on table "public"."user_role_permission" to "service_role";

grant insert on table "public"."user_role_permission" to "service_role";

grant references on table "public"."user_role_permission" to "service_role";

grant select on table "public"."user_role_permission" to "service_role";

grant trigger on table "public"."user_role_permission" to "service_role";

grant truncate on table "public"."user_role_permission" to "service_role";

grant update on table "public"."user_role_permission" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";

grant delete on table "public"."wallet" to "anon";

grant insert on table "public"."wallet" to "anon";

grant references on table "public"."wallet" to "anon";

grant select on table "public"."wallet" to "anon";

grant trigger on table "public"."wallet" to "anon";

grant truncate on table "public"."wallet" to "anon";

grant update on table "public"."wallet" to "anon";

grant delete on table "public"."wallet" to "authenticated";

grant insert on table "public"."wallet" to "authenticated";

grant references on table "public"."wallet" to "authenticated";

grant select on table "public"."wallet" to "authenticated";

grant trigger on table "public"."wallet" to "authenticated";

grant truncate on table "public"."wallet" to "authenticated";

grant update on table "public"."wallet" to "authenticated";

grant delete on table "public"."wallet" to "service_role";

grant insert on table "public"."wallet" to "service_role";

grant references on table "public"."wallet" to "service_role";

grant select on table "public"."wallet" to "service_role";

grant trigger on table "public"."wallet" to "service_role";

grant truncate on table "public"."wallet" to "service_role";

grant update on table "public"."wallet" to "service_role";

grant delete on table "public"."wallet_transaction" to "anon";

grant insert on table "public"."wallet_transaction" to "anon";

grant references on table "public"."wallet_transaction" to "anon";

grant select on table "public"."wallet_transaction" to "anon";

grant trigger on table "public"."wallet_transaction" to "anon";

grant truncate on table "public"."wallet_transaction" to "anon";

grant update on table "public"."wallet_transaction" to "anon";

grant delete on table "public"."wallet_transaction" to "authenticated";

grant insert on table "public"."wallet_transaction" to "authenticated";

grant references on table "public"."wallet_transaction" to "authenticated";

grant select on table "public"."wallet_transaction" to "authenticated";

grant trigger on table "public"."wallet_transaction" to "authenticated";

grant truncate on table "public"."wallet_transaction" to "authenticated";

grant update on table "public"."wallet_transaction" to "authenticated";

grant delete on table "public"."wallet_transaction" to "service_role";

grant insert on table "public"."wallet_transaction" to "service_role";

grant references on table "public"."wallet_transaction" to "service_role";

grant select on table "public"."wallet_transaction" to "service_role";

grant trigger on table "public"."wallet_transaction" to "service_role";

grant truncate on table "public"."wallet_transaction" to "service_role";

grant update on table "public"."wallet_transaction" to "service_role";

CREATE TRIGGER trg_nfc_cards_updated_at BEFORE UPDATE ON public.nfc_cards FOR EACH ROW EXECUTE FUNCTION public.set_nfc_cards_updated_at();

CREATE TRIGGER trigger_auto_create_app_event AFTER INSERT ON public.scraped_gdg_events FOR EACH ROW EXECUTE FUNCTION public.auto_create_app_event();

CREATE TRIGGER on_new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


