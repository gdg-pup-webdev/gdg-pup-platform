-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.article (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  published_at timestamp with time zone,
  is_published boolean NOT NULL DEFAULT false,
  author_id uuid,
  title text NOT NULL,
  body text,
  related_event_id uuid,
  CONSTRAINT article_pkey PRIMARY KEY (id),
  CONSTRAINT article_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.user(id),
  CONSTRAINT article_related_event_id_fkey FOREIGN KEY (related_event_id) REFERENCES public.event(id)
);
CREATE TABLE public.article_comment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid,
  user_id uuid,
  body text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT article_comment_pkey PRIMARY KEY (id),
  CONSTRAINT article_comment_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.article(id),
  CONSTRAINT article_comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
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
  CONSTRAINT event_pkey PRIMARY KEY (id),
  CONSTRAINT events_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.user(id)
);
CREATE TABLE public.event_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  event_id uuid NOT NULL,
  is_present boolean NOT NULL DEFAULT false,
  checkin_method text NOT NULL,
  CONSTRAINT event_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT event_attendance_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.event(id)
);
CREATE TABLE public.external_resource (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text,
  resource_url text NOT NULL,
  uploader_id uuid NOT NULL,
  CONSTRAINT external_resource_pkey PRIMARY KEY (id),
  CONSTRAINT resource_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES public.user(id)
);
CREATE TABLE public.nfc_card (
  id uuid NOT NULL,
  user_id uuid,
  status text NOT NULL DEFAULT 'READY'::text CHECK (status = ANY (ARRAY['READY'::text, 'ACTIVE'::text, 'LOST'::text, 'DISABLED'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  activated_at timestamp with time zone,
  CONSTRAINT nfc_card_pkey PRIMARY KEY (id),
  CONSTRAINT nfc_card_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.nfc_card_transaction (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type = ANY (ARRAY['TAP_PROFILE'::text, 'TAP_CHECKIN'::text, 'ACTIVATION'::text])),
  scanner_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nfc_card_transaction_pkey PRIMARY KEY (id),
  CONSTRAINT nfc_card_transaction_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.nfc_card(id),
  CONSTRAINT nfc_card_transaction_scanner_id_fkey FOREIGN KEY (scanner_id) REFERENCES public.user(id)
);
CREATE TABLE public.resource_tag (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tag_name text NOT NULL,
  CONSTRAINT resource_tag_pkey PRIMARY KEY (id)
);
CREATE TABLE public.resource_tag_junction (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL,
  resource_tag_id uuid NOT NULL,
  CONSTRAINT resource_tag_junction_pkey PRIMARY KEY (id),
  CONSTRAINT resource_tag_junction_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.external_resource(id),
  CONSTRAINT resource_tag_junction_resource_tag_id_fkey FOREIGN KEY (resource_tag_id) REFERENCES public.resource_tag(id)
);
CREATE TABLE public.reward (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  value bigint NOT NULL,
  is_claimed boolean NOT NULL DEFAULT false,
  user_id uuid NOT NULL,
  CONSTRAINT reward_pkey PRIMARY KEY (id),
  CONSTRAINT reward_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.study_jam (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  recording_url text NOT NULL,
  summary text NOT NULL,
  CONSTRAINT study_jam_pkey PRIMARY KEY (id)
);
CREATE TABLE public.team (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  CONSTRAINT team_pkey PRIMARY KEY (id)
);
CREATE TABLE public.team_member (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL,
  user_id uuid NOT NULL,
  team_id uuid NOT NULL,
  CONSTRAINT team_member_pkey PRIMARY KEY (id),
  CONSTRAINT team_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT team_member_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(id)
);
CREATE TABLE public.user (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  gdg_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  email text NOT NULL,
  display_name text NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  status text NOT NULL DEFAULT 'active'::text,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
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
  CONSTRAINT user_achievement_pkey PRIMARY KEY (id),
  CONSTRAINT user_achievement_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.user_certificate (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  CONSTRAINT user_certificate_pkey PRIMARY KEY (id),
  CONSTRAINT user_certificate_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.user_profile (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  bio text,
  program text,
  year_level smallint,
  skills_summary text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  is_public boolean NOT NULL DEFAULT true,
  CONSTRAINT user_profile_pkey PRIMARY KEY (id),
  CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
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
  CONSTRAINT user_project_pkey PRIMARY KEY (id),
  CONSTRAINT user_project_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.user_role (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role_name text NOT NULL UNIQUE,
  description text NOT NULL,
  CONSTRAINT user_role_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_role_junction (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  CONSTRAINT user_role_junction_pkey PRIMARY KEY (id),
  CONSTRAINT user_role_junction_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_role(id),
  CONSTRAINT user_role_junction_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.user_role_permission (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_role_id uuid NOT NULL,
  resource_name text NOT NULL,
  can_read boolean NOT NULL,
  can_write boolean NOT NULL,
  can_update boolean NOT NULL,
  can_delete boolean NOT NULL,
  CONSTRAINT user_role_permission_pkey PRIMARY KEY (id),
  CONSTRAINT user_role_permission_user_role_id_fkey FOREIGN KEY (user_role_id) REFERENCES public.user_role(id)
);
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  color_theme boolean NOT NULL,
  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.wallet (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  balance bigint NOT NULL,
  CONSTRAINT wallet_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.wallet_transaction (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  source_type text NOT NULL,
  source_id text NOT NULL,
  amount bigint NOT NULL DEFAULT '0'::bigint,
  wallet_id uuid NOT NULL,
  CONSTRAINT wallet_transaction_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_transaction_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallet(id)
);