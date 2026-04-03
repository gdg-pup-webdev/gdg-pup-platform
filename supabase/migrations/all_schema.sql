


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


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "storage";


ALTER SCHEMA "storage" OWNER TO "supabase_admin";


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


CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE "storage"."buckettype" OWNER TO "supabase_storage_admin";


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
    "email" "public"."citext" NOT NULL,
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


CREATE OR REPLACE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."enforce_bucket_name_length"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION "storage"."enforce_bucket_name_length"() OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION "storage"."extension"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION "storage"."filename"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION "storage"."foldername"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."get_common_prefix"("p_key" "text", "p_prefix" "text", "p_delimiter" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION "storage"."get_common_prefix"("p_key" "text", "p_prefix" "text", "p_delimiter" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."get_level"("name" "text") RETURNS integer
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION "storage"."get_level"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."get_prefix"("name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION "storage"."get_prefix"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."get_prefixes"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION "storage"."get_prefixes"("name" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION "storage"."get_size_by_bucket"() OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."list_objects_with_delimiter"("_bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION "storage"."list_objects_with_delimiter"("_bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text", "sort_order" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION "storage"."operation"() OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."protect_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "storage"."protect_delete"() OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."search_by_timestamp"("p_prefix" "text", "p_bucket_id" "text", "p_limit" integer, "p_level" integer, "p_start_after" "text", "p_sort_order" "text", "p_sort_column" "text", "p_sort_column_after" "text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION "storage"."search_by_timestamp"("p_prefix" "text", "p_bucket_id" "text", "p_limit" integer, "p_level" integer, "p_start_after" "text", "p_sort_order" "text", "p_sort_column" "text", "p_sort_column_after" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text", "sort_column" "text" DEFAULT 'name'::"text", "sort_column_after" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer, "levels" integer, "start_after" "text", "sort_order" "text", "sort_column" "text", "sort_column_after" "text") OWNER TO "supabase_storage_admin";


CREATE OR REPLACE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION "storage"."update_updated_at_column"() OWNER TO "supabase_storage_admin";


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



CREATE TABLE IF NOT EXISTS "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text",
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);


ALTER TABLE "storage"."buckets" OWNER TO "supabase_storage_admin";


COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';



CREATE TABLE IF NOT EXISTS "storage"."buckets_analytics" (
    "name" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
    "format" "text" DEFAULT 'ICEBERG'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "storage"."buckets_analytics" OWNER TO "supabase_storage_admin";


CREATE TABLE IF NOT EXISTS "storage"."buckets_vectors" (
    "id" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'VECTOR'::"storage"."buckettype" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."buckets_vectors" OWNER TO "supabase_storage_admin";


CREATE TABLE IF NOT EXISTS "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "storage"."migrations" OWNER TO "supabase_storage_admin";


CREATE TABLE IF NOT EXISTS "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb"
);


ALTER TABLE "storage"."objects" OWNER TO "supabase_storage_admin";


COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';



CREATE TABLE IF NOT EXISTS "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


ALTER TABLE "storage"."s3_multipart_uploads" OWNER TO "supabase_storage_admin";


CREATE TABLE IF NOT EXISTS "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."s3_multipart_uploads_parts" OWNER TO "supabase_storage_admin";


CREATE TABLE IF NOT EXISTS "storage"."vector_indexes" (
    "id" "text" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "bucket_id" "text" NOT NULL,
    "data_type" "text" NOT NULL,
    "dimension" integer NOT NULL,
    "distance_metric" "text" NOT NULL,
    "metadata_configuration" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "storage"."vector_indexes" OWNER TO "supabase_storage_admin";


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



ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."buckets_vectors"
    ADD CONSTRAINT "buckets_vectors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");



ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_pkey" PRIMARY KEY ("id");



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



CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");



CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");



CREATE UNIQUE INDEX "buckets_analytics_unique_name_idx" ON "storage"."buckets_analytics" USING "btree" ("name") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");



CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");



CREATE INDEX "idx_objects_bucket_id_name_lower" ON "storage"."objects" USING "btree" ("bucket_id", "lower"("name") COLLATE "C");



CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");



CREATE UNIQUE INDEX "vector_indexes_name_bucket_id_idx" ON "storage"."vector_indexes" USING "btree" ("name", "bucket_id");



CREATE OR REPLACE TRIGGER "populate_user_when_signup_success" AFTER INSERT ON "public"."user_credential" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();



CREATE OR REPLACE TRIGGER "trg_nfc_cards_updated_at" BEFORE UPDATE ON "public"."nfc_cards" FOR EACH ROW EXECUTE FUNCTION "public"."set_nfc_cards_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_auto_create_app_event" AFTER INSERT ON "public"."scraped_gdg_events" FOR EACH ROW EXECUTE FUNCTION "public"."auto_create_app_event"();



CREATE OR REPLACE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();



CREATE OR REPLACE TRIGGER "protect_buckets_delete" BEFORE DELETE ON "storage"."buckets" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."protect_delete"();



CREATE OR REPLACE TRIGGER "protect_objects_delete" BEFORE DELETE ON "storage"."objects" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."protect_delete"();



CREATE OR REPLACE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();



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



ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");



ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "storage"."vector_indexes"
    ADD CONSTRAINT "vector_indexes_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets_vectors"("id");



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


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT USAGE ON SCHEMA "storage" TO "postgres" WITH GRANT OPTION;
GRANT USAGE ON SCHEMA "storage" TO "anon";
GRANT USAGE ON SCHEMA "storage" TO "authenticated";
GRANT USAGE ON SCHEMA "storage" TO "service_role";
GRANT ALL ON SCHEMA "storage" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON SCHEMA "storage" TO "dashboard_user";



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



REVOKE ALL ON TABLE "storage"."buckets" FROM "supabase_storage_admin";
GRANT ALL ON TABLE "storage"."buckets" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON TABLE "storage"."buckets" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets" TO "anon";
GRANT ALL ON TABLE "storage"."buckets" TO "postgres" WITH GRANT OPTION;



GRANT ALL ON TABLE "storage"."buckets_analytics" TO "service_role";
GRANT ALL ON TABLE "storage"."buckets_analytics" TO "authenticated";
GRANT ALL ON TABLE "storage"."buckets_analytics" TO "anon";



GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "service_role";
GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "authenticated";
GRANT SELECT ON TABLE "storage"."buckets_vectors" TO "anon";



REVOKE ALL ON TABLE "storage"."objects" FROM "supabase_storage_admin";
GRANT ALL ON TABLE "storage"."objects" TO "supabase_storage_admin" WITH GRANT OPTION;
GRANT ALL ON TABLE "storage"."objects" TO "service_role";
GRANT ALL ON TABLE "storage"."objects" TO "authenticated";
GRANT ALL ON TABLE "storage"."objects" TO "anon";
GRANT ALL ON TABLE "storage"."objects" TO "postgres" WITH GRANT OPTION;



GRANT ALL ON TABLE "storage"."s3_multipart_uploads" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads" TO "anon";



GRANT ALL ON TABLE "storage"."s3_multipart_uploads_parts" TO "service_role";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "authenticated";
GRANT SELECT ON TABLE "storage"."s3_multipart_uploads_parts" TO "anon";



GRANT SELECT ON TABLE "storage"."vector_indexes" TO "service_role";
GRANT SELECT ON TABLE "storage"."vector_indexes" TO "authenticated";
GRANT SELECT ON TABLE "storage"."vector_indexes" TO "anon";



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






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON SEQUENCES TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON FUNCTIONS TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "storage" GRANT ALL ON TABLES TO "service_role";




