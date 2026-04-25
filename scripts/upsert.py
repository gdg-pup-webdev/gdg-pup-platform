import os
import csv
from dotenv import load_dotenv
from supabase import create_client, Client

# --- CONFIGURATION & PLACEHOLDERS ---

# Load environment variables from the .env file in the root directory
# Make sure your current working directory is the root of the project, or specify the path to .env
load_dotenv()

# 1. Supabase Credentials
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SECRET_KEY")

# 2. Local CSV File Path
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), 'members.csv')

# 3. Supabase Table Name
TABLE_NAME = os.environ.get("SUPABASE_MEMBERS_TABLE")

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env file.")
        return

    # --- Initialize Supabase Client ---
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")
        return

    # --- Fetch Existing Records ---
    print(f"Fetching existing records from '{TABLE_NAME}' to check for matches...")
    existing_records = []
    page_size = 1000
    offset = 0
    try:
        # We handle pagination in case there are more than 1000 existing records
        while True:
            response = supabase.table(TABLE_NAME).select("gdg_id, email, first_name").range(offset, offset + page_size - 1).execute()
            if not response.data:
                break
            existing_records.extend(response.data)
            if len(response.data) < page_size:
                break
            offset += page_size
    except Exception as e:
        print(f"Error fetching existing records: {e}")
        return

    # Build a map of (email, first_name) -> gdg_id, and find the highest gdg_id number
    existing_map = {}
    max_gdg_id_num = 1687  # Base number to increment from as requested

    for rec in existing_records:
        email = (rec.get("email") or "").strip().lower()
        if email:
            existing_map[email] = rec.get("gdg_id")

    print(f"Found {len(existing_records)} existing records. Incrementing new IDs from GDGPUP-26-{max_gdg_id_num:06d}.")

    # --- Read Data from CSV ---
    updates = []
    inserts = []
    csv_duplicates_found = set()
    
    try:
        print(f"Reading data from {CSV_FILE_PATH}...")
        
        # 1. Deduplicate CSV data first
        unique_csv_rows = {}
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                email = (row.get("email") or "").strip().lower()
                if not email:
                    continue # skip rows without emails
                    
                if email in unique_csv_rows:
                    csv_duplicates_found.add(email)
                
                # Keep the latest row for this email
                unique_csv_rows[email] = row
                
        # Print duplicates if any
        if csv_duplicates_found:
            print(f"\n⚠️ WARNING: Found {len(csv_duplicates_found)} duplicate emails in the CSV file!")
            print(f"The script is automatically deduplicating them by keeping the latest entry.")
            print("Duplicate emails:")
            for i, dup in enumerate(sorted(list(csv_duplicates_found)), 1):
                print(f"  {i}. {dup}")
            print("\n")

        # 2. Process the unique rows
        for row in unique_csv_rows.values():
            # Remove gdg_id from the CSV row; we will manage it manually
            row.pop("gdg_id", None)
            
            # Clean up the row: replace empty strings with None
            cleaned_row = {k: (None if v == '' else v) for k, v in row.items()}
            
            # Convert string booleans to actual booleans
            for key in ['is_public', 'is_onboarded']:
                if cleaned_row.get(key) == 'TRUE':
                    cleaned_row[key] = True
                elif cleaned_row.get(key) == 'FALSE':
                    cleaned_row[key] = False
            
            # Convert year_level to int if possible
            yl = cleaned_row.get('year_level')
            if yl is not None:
                if isinstance(yl, str):
                    yl_lower = yl.strip().lower()
                    if yl_lower == "first year":
                        cleaned_row['year_level'] = 1
                    elif yl_lower == "second year":
                        cleaned_row['year_level'] = 2
                    elif yl_lower == "third year":
                        cleaned_row['year_level'] = 3
                    elif yl_lower == "fourth year":
                        cleaned_row['year_level'] = 4
                    elif yl_lower == "fifth year":
                        cleaned_row['year_level'] = 5
                    else:
                        try:
                            cleaned_row['year_level'] = int(yl)
                        except ValueError:
                            cleaned_row['year_level'] = None
            
            email = cleaned_row.get("email").strip().lower()
            
            if email in existing_map:
                # Existing record found -> Update
                cleaned_row["gdg_id"] = existing_map[email]
                updates.append(cleaned_row)
            else:
                # No record found -> Insert (Generate new gdg_id)
                max_gdg_id_num += 1
                new_gdg_id = f"GDGPUP-26-{max_gdg_id_num:06d}"
                cleaned_row["gdg_id"] = new_gdg_id
                
                # Add to map just in case, though we already deduplicated
                existing_map[email] = new_gdg_id 
                inserts.append(cleaned_row)
                    
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return

    # --- Print Report Before Processing ---
    print(f"\n--- UPSERT REPORT PREVIEW ---")
    print(f"Records to UPDATE (Matched by email & first_name): {len(updates)}")
    print(f"Records to INSERT (New members): {len(inserts)}")
    print(f"Total unique rows to process: {len(updates) + len(inserts)}")
    print(f"-----------------------------\n")

    # Write detailed report to file
    report_path = os.path.join(os.path.dirname(__file__), 'upsert_report.txt')
    try:
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("--- UPSERT DETAILED REPORT ---\n\n")
            f.write(f"Total Records to Process: {len(updates) + len(inserts)}\n")
            f.write(f"Updates: {len(updates)}\n")
            f.write(f"Inserts: {len(inserts)}\n\n")
            
            f.write("--- UPDATED RECORDS ---\n")
            for u in updates:
                f.write(f"- {u.get('gdg_id')} | {u.get('email')} | {u.get('first_name')} {u.get('last_name')}\n")
                
            f.write("\n--- INSERTED RECORDS ---\n")
            for i in inserts:
                f.write(f"- {i.get('gdg_id')} | {i.get('email')} | {i.get('first_name')} {i.get('last_name')}\n")
                
        print(f"📝 Detailed report saved to {report_path}\n")
    except Exception as e:
        print(f"⚠️ Could not write report file: {e}")

    all_data = updates + inserts
    if not all_data:
        print("No data to process.")
        return

    # --- Perform the Upsert in Batches ---
    try:
        print(f"Upserting data into '{TABLE_NAME}' table in batches...")
        
        batch_size = 500
        successful_upserts = 0
        
        for i in range(0, len(all_data), batch_size):
            batch = all_data[i:i+batch_size]
            response = supabase.table(TABLE_NAME).upsert(batch, on_conflict="gdg_id").execute()
            if response.data:
                successful_upserts += len(response.data)
                
        print(f"\n✅ SUCCESSFULLY PROCESSED!")
        print(f"Database reflects {successful_upserts} records processed (Updates + Inserts).")
            
    except Exception as e:
        print(f"❌ An error occurred during the upsert process: {e}")

if __name__ == "__main__":
    main()
