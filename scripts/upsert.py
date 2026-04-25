import os
import csv
from dotenv import load_dotenv
from supabase import create_client, Client

# --- CONFIGURATION ---

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SECRET_KEY")
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), 'members.csv')
TABLE_NAME = os.environ.get("SUPABASE_MEMBERS_TABLE")
REPORT_PATH = os.path.join(os.path.dirname(__file__), 'upsert_report.txt')

# Base number to increment new GDG IDs from
BASE_GDG_ID_NUM = 1731

# Fields to skip when diffing (internal/managed fields)
DIFF_SKIP_FIELDS = {"gdg_id", "created_at", "updated_at"}


def fetch_all_pages(supabase: Client, table: str, select: str = "*") -> list[dict]:
    """Fetch all rows from a table using pagination."""
    results = []
    page_size = 1000
    offset = 0
    while True:
        response = (
            supabase.table(table)
            .select(select)
            .range(offset, offset + page_size - 1)
            .execute()
        )
        if not response.data:
            break
        results.extend(response.data)
        if len(response.data) < page_size:
            break
        offset += page_size
    return results


def compute_diff(existing: dict, incoming: dict) -> list[tuple[str, any, any]]:
    """
    Compare incoming CSV row against the existing DB record.
    Returns a list of (field, old_value, new_value) for changed fields.
    """
    changes = []
    for field, new_val in incoming.items():
        if field in DIFF_SKIP_FIELDS:
            continue
        old_val = existing.get(field)

        # Normalize for comparison: treat None and empty string as equivalent
        normalized_old = old_val if old_val != "" else None
        normalized_new = new_val if new_val != "" else None

        if normalized_old != normalized_new:
            changes.append((field, old_val, new_val))
    return changes


def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env file.")
        return

    if not TABLE_NAME:
        print("Error: Missing SUPABASE_MEMBERS_TABLE in .env file.")
        return

    # --- Initialize Supabase Client ---
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
        return

    # --- Read & Deduplicate CSV ---
    print(f"Reading data from {CSV_FILE_PATH}...")
    unique_csv_rows: dict[str, dict] = {}
    csv_duplicates_found: set[str] = set()

    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                email = (row.get("email") or "").strip().lower()
                if not email:
                    continue
                if email in unique_csv_rows:
                    csv_duplicates_found.add(email)
                unique_csv_rows[email] = row
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return

    if csv_duplicates_found:
        print(f"\n⚠️  WARNING: {len(csv_duplicates_found)} duplicate email(s) in CSV — keeping latest entry.")
        for i, dup in enumerate(sorted(csv_duplicates_found), 1):
            print(f"  {i}. {dup}")
        print()

    # --- Fetch ALL existing records (full rows) ---
    print("Fetching existing records from DB for diff comparison...")
    try:
        existing_records_list = fetch_all_pages(supabase, TABLE_NAME, select="*")
    except Exception as e:
        print(f"Error fetching existing records: {e}")
        return

    # Map email -> full DB record
    existing_map: dict[str, dict] = {}
    for rec in existing_records_list:
        email = (rec.get("email") or "").strip().lower()
        if email:
            existing_map[email] = rec

    print(f"Found {len(existing_map)} existing record(s) in the DB.\n")

    # --- Process Rows ---
    gdg_id_counter = BASE_GDG_ID_NUM
    rows_to_upsert: list[dict] = []
    inserts: list[dict] = []
    updates: list[dict] = []                  # (cleaned_row, [(field, old, new)])
    update_diffs: dict[str, list] = {}        # email -> list of (field, old, new)

    for email, row in unique_csv_rows.items():
        row.pop("gdg_id", None)
        row["email"] = email

        # Replace empty strings with None
        cleaned_row = {k: (None if v == "" else v) for k, v in row.items()}

        # Boolean conversion
        for key in ["is_public", "is_onboarded"]:
            val = cleaned_row.get(key)
            if val == "TRUE":
                cleaned_row[key] = True
            elif val == "FALSE":
                cleaned_row[key] = False

        # year_level conversion
        yl = cleaned_row.get("year_level")
        if yl is not None:
            year_map = {
                "first year": 1, "second year": 2, "third year": 3,
                "fourth year": 4, "fifth year": 5,
            }
            if isinstance(yl, str):
                mapped = year_map.get(yl.strip().lower())
                if mapped is not None:
                    cleaned_row["year_level"] = mapped
                else:
                    try:
                        cleaned_row["year_level"] = int(yl)
                    except ValueError:
                        cleaned_row["year_level"] = None

        if email in existing_map:
            # Assign existing gdg_id so on_conflict="gdg_id" can match this row
            cleaned_row["gdg_id"] = existing_map[email]["gdg_id"]
            # Compute diff before upserting
            diffs = compute_diff(existing_map[email], cleaned_row)
            update_diffs[email] = diffs
            updates.append(cleaned_row)
        else:
            gdg_id_counter += 1
            cleaned_row["gdg_id"] = f"GDGPUP-26-{gdg_id_counter:06d}"
            inserts.append(cleaned_row)

        rows_to_upsert.append(cleaned_row)

    # --- Console Summary ---
    print(f"--- UPSERT REPORT PREVIEW ---")
    print(f"Records to UPDATE (matched by email): {len(updates)}")
    print(f"Records to INSERT (new members):      {len(inserts)}")
    print(f"Total rows to process:                {len(rows_to_upsert)}")
    print(f"-----------------------------\n")

    # --- Write Detailed Report (pre-upsert diff) ---
    try:
        with open(REPORT_PATH, 'w', encoding='utf-8') as f:
            f.write("=== UPSERT REPORT ===\n\n")
            f.write(f"Total to process : {len(rows_to_upsert)}\n")
            f.write(f"Updates          : {len(updates)}\n")
            f.write(f"Inserts          : {len(inserts)}\n\n")

            # --- Updates with field diffs ---
            f.write("=" * 60 + "\n")
            f.write("UPDATED RECORDS (field-level changes)\n")
            f.write("=" * 60 + "\n\n")
            for row in updates:
                email = row.get("email")
                diffs = update_diffs.get(email, [])
                f.write(f"✏️  {email} | {row.get('first_name')} {row.get('last_name')}\n")
                if diffs:
                    for field, old_val, new_val in diffs:
                        f.write(f"    {field}: {repr(old_val)} → {repr(new_val)}\n")
                else:
                    f.write("    (no changes detected)\n")
                f.write("\n")

            # --- Inserts ---
            f.write("=" * 60 + "\n")
            f.write("INSERTED RECORDS (new members)\n")
            f.write("=" * 60 + "\n\n")
            for row in inserts:
                f.write(f"➕ {row.get('gdg_id')} | {row.get('email')} | {row.get('first_name')} {row.get('last_name')}\n")

        print(f"📝 Detailed diff report saved to {REPORT_PATH}\n")
    except Exception as e:
        print(f"⚠️  Could not write report file: {e}")

    if not rows_to_upsert:
        print("No data to process.")
        return

    # --- Perform Upsert in Batches ---
    # Requires a UNIQUE constraint on `email` in Supabase.
    try:
        print(f"Upserting data into '{TABLE_NAME}' table in batches...")
        batch_size = 500
        successful_upserts = 0

        for i in range(0, len(rows_to_upsert), batch_size):
            batch = rows_to_upsert[i:i + batch_size]
            response = (
                supabase.table(TABLE_NAME)
                .upsert(batch, on_conflict="gdg_id")
                .execute()
            )
            if response.data:
                successful_upserts += len(response.data)

        print(f"✅ SUCCESSFULLY PROCESSED!")
        print(f"   {successful_upserts} records upserted ({len(updates)} updated, {len(inserts)} inserted).")

    except Exception as e:
        print(f"❌ An error occurred during the upsert process: {e}")


if __name__ == "__main__":
    main()
