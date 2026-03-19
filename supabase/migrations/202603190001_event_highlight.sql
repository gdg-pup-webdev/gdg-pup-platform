create table "public"."event_highlight" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text not null,
    "content" text not null,
    "image_url" text,
    "author_id" uuid not null,
    "event_id" uuid not null
);

alter table "public"."event_highlight" add constraint "event_highlight_author_id_fkey" FOREIGN KEY (author_id) REFERENCES "user"(id) ON DELETE CASCADE;

alter table "public"."event_highlight" add constraint "event_highlight_event_id_fkey" FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX event_highlight_pkey ON public.event_highlight USING btree (id);
alter table "public"."event_highlight" add constraint "event_highlight_pkey" PRIMARY KEY using index "event_highlight_pkey";
