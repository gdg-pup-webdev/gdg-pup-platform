-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.article (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  published_at timestamp with time zone,
  is_published boolean NOT NULL DEFAULT false,
  author_id text,
  title text NOT NULL,
  content text,
  eventId uuid,
  description text,
  thumbnail_url text,
  CONSTRAINT article_pkey PRIMARY KEY (id)
);
CREATE TABLE public.dp_download_analytics (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  event_slug text NOT NULL,
  frame_id text NOT NULL,
  source_path text,
  user_agent text,
  downloaded_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT dp_download_analytics_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  creator_id uuid,
  title text NOT NULL,
  description text,
  category text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  venue text,
  attendance_points bigint NOT NULL DEFAULT '0'::bigint,
  attendees_count bigint NOT NULL DEFAULT '0'::bigint,
  rsvp bigint,
  gdg_event_id bigint UNIQUE,
  thumbnail_url text,
  bevy_preview_url text,
  short_description text,
  max_capacity text,
  tags text,
  speakers ARRAY DEFAULT '{}'::text[],
  type text,
  team_id uuid,
  CONSTRAINT event_pkey PRIMARY KEY (id),
  CONSTRAINT event_gdg_event_id_fkey FOREIGN KEY (gdg_event_id) REFERENCES public.scraped_gdg_events(gdg_id),
  CONSTRAINT event_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id)
);
CREATE TABLE public.event_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  event_id uuid NOT NULL,
  is_present boolean NOT NULL DEFAULT false,
  checkin_method text NOT NULL,
  CONSTRAINT event_attendance_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id)
);
CREATE TABLE public.file_record (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  file_name text,
  file_description text,
  file_path text,
  preview_url text,
  storage_ref text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  file_type text NOT NULL DEFAULT ''::text,
  folder_id uuid,
  CONSTRAINT file_record_pkey PRIMARY KEY (id),
  CONSTRAINT file_record_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.filesystem_folder(id)
);
CREATE TABLE public.filesystem_folder (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  parent_id uuid,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT filesystem_folder_pkey PRIMARY KEY (id),
  CONSTRAINT filesystem_folder_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.filesystem_folder(id)
);
CREATE TABLE public.gdg_members (
  gdg_id text NOT NULL UNIQUE,
  email USER-DEFINED NOT NULL,
  program text,
  department text,
  display_name text,
  first_name text,
  last_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  suffix text,
  bio text,
  year_level smallint,
  skills_summary text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  is_public boolean,
  membership_type text,
  other_links text,
  technical_skills text,
  learning_interests text,
  tools_and_technologies text,
  nickname text,
  avatar_image_url text,
  middle_name text,
  CONSTRAINT gdg_members_pkey PRIMARY KEY (gdg_id)
);
CREATE TABLE public.gdg_merch (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  image_url text,
  points_cost bigint,
  stock text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT gdg_merch_pkey PRIMARY KEY (id)
);
CREATE TABLE public.learning_resource (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  thumbnail_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  team_id uuid,
  event_id uuid,
  tags jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT learning_resource_pkey PRIMARY KEY (id),
  CONSTRAINT learning_resource_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id),
  CONSTRAINT learning_resource_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id)
);
CREATE TABLE public.member_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  startDate timestamp with time zone,
  endDate timestamp with time zone,
  description text,
  mainImageUrl text,
  secondaryImageUrl text,
  tertiaryImageUrl text,
  memberGdgId text,
  createdAt timestamp with time zone NOT NULL DEFAULT now(),
  updatedAt timestamp with time zone,
  CONSTRAINT member_projects_pkey PRIMARY KEY (id),
  CONSTRAINT member_projects_memberGdgId_fkey FOREIGN KEY (memberGdgId) REFERENCES public.gdg_members(gdg_id)
);
CREATE TABLE public.member_showcase (
  id uuid NOT NULL,
  thumbnail_url text NOT NULL,
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  description text NOT NULL,
  article_url text NOT NULL,
  showcased_members ARRAY NOT NULL DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT member_showcase_pkey PRIMARY KEY (id)
);
CREATE TABLE public.nfc_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  gdg_id text NOT NULL UNIQUE,
  status USER-DEFINED NOT NULL DEFAULT 'issued'::nfc_card_status,
  activated_at timestamp with time zone,
  suspended_at timestamp with time zone,
  revoked_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  destination_url text,
  CONSTRAINT nfc_cards_pkey PRIMARY KEY (id),
  CONSTRAINT nfc_cards_gdg_id_fkey FOREIGN KEY (gdg_id) REFERENCES public.gdg_members(gdg_id)
);
CREATE TABLE public.one_time_pins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reference text NOT NULL,
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  is_used boolean NOT NULL,
  CONSTRAINT one_time_pins_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reward (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  value bigint NOT NULL,
  is_claimed boolean NOT NULL DEFAULT false,
  user_id uuid NOT NULL,
  CONSTRAINT reward_pkey PRIMARY KEY (id)
);
CREATE TABLE public.scraped_gdg_events (
  gdg_id bigint NOT NULL,
  title text NOT NULL,
  description_short text,
  url text NOT NULL UNIQUE,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  location text,
  cover_image_url text,
  status text,
  event_type text,
  last_scraped_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  description text,
  tags ARRAY,
  total_attendees integer,
  total_capacity integer,
  attendee_virtual_venue_link text,
  event_type_slug text,
  video_url text,
  is_virtual_event boolean,
  image_square_url text,
  CONSTRAINT scraped_gdg_events_pkey PRIMARY KEY (gdg_id)
);
CREATE TABLE public.sparkmates_metric_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  gdg_id text NOT NULL,
  source USER-DEFINED NOT NULL DEFAULT 'direct_link'::sparkmates_source,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sparkmates_metric_events_pkey PRIMARY KEY (id),
  CONSTRAINT sparkmates_metric_events_gdg_id_fkey FOREIGN KEY (gdg_id) REFERENCES public.gdg_members(gdg_id)
);
CREATE TABLE public.survey (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  slug character varying NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  attendance_code character varying,
  close_time timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  questions_schema jsonb,
  CONSTRAINT survey_pkey PRIMARY KEY (id),
  CONSTRAINT survey_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id)
);
CREATE TABLE public.survey_response (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL,
  event_id uuid NOT NULL,
  email character varying NOT NULL,
  gdg_id text,
  survey_data jsonb NOT NULL,
  certificate_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT survey_response_pkey PRIMARY KEY (id),
  CONSTRAINT survey_response_survey_id_fkey FOREIGN KEY (survey_id) REFERENCES public.survey(id),
  CONSTRAINT survey_response_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id)
);
CREATE TABLE public.task (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text,
  description text,
  points_on_completion bigint,
  is_completed boolean,
  completed_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT task_pkey PRIMARY KEY (id)
);
CREATE TABLE public.team (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  responsibilities text,
  parent_team_id uuid,
  CONSTRAINT team_pkey PRIMARY KEY (id),
  CONSTRAINT team_parent_team_id_fkey FOREIGN KEY (parent_team_id) REFERENCES public.team(id)
);
CREATE TABLE public.team_member (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL,
  team_id uuid NOT NULL,
  user_id text NOT NULL,
  CONSTRAINT team_member_pkey PRIMARY KEY (id),
  CONSTRAINT team_member_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id),
  CONSTRAINT team_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.gdg_members(gdg_id)
);
CREATE TABLE public.user_achievement (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  achieved_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_achievement_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_certificate (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  CONSTRAINT user_certificate_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_credential (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email_address text NOT NULL,
  username text NOT NULL,
  password_hash text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_credential_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_credential_reference_code (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reference_code text NOT NULL,
  email_address text,
  payload jsonb,
  type text,
  otp_reference text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_credential_reference_code_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_project (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text,
  tech_stack text,
  repo_url text,
  demo_url text,
  CONSTRAINT user_project_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_role (
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT user_role_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_role_junction (
  role_id uuid NOT NULL,
  gdg_id text NOT NULL,
  CONSTRAINT user_role_junction_pkey PRIMARY KEY (role_id, gdg_id),
  CONSTRAINT user_role_junction_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_role(id),
  CONSTRAINT user_role_junction_gdg_id_fkey FOREIGN KEY (gdg_id) REFERENCES public.gdg_members(gdg_id)
);
CREATE TABLE public.user_role_permission (
  role_id uuid NOT NULL,
  resource text NOT NULL,
  action text NOT NULL,
  CONSTRAINT user_role_permission_pkey PRIMARY KEY (role_id, resource, action),
  CONSTRAINT user_role_permission_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_role(id)
);
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  color_theme boolean NOT NULL,
  CONSTRAINT user_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wallet (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  balance bigint NOT NULL,
  webdev_points bigint,
  spark_points bigint NOT NULL DEFAULT '0'::bigint,
  CONSTRAINT wallet_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wallet_transaction (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  source_type text NOT NULL,
  source_id text NOT NULL,
  amount bigint NOT NULL DEFAULT '0'::bigint,
  user_id uuid NOT NULL,
  point_type text,
  CONSTRAINT wallet_transaction_pkey PRIMARY KEY (id)
);