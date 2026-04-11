# 🏭 NFC Card Encoding & Factory Guide

This document outlines the technical methods for "burning" (encoding) our system URLs into the NFC cards. This step must happen **before** the cards are distributed to users.

## 1. The Goal

Every card must hold a unique URL record (NDEF Record).

- **Format:** `https://gdgpup.org/sparkmates/[GDG_ID]?source=nfc_card`
- **Purpose:** A direct entry point to the assigned member's public Sparkmates profile.

---

## 2. Encoding Methods

### Option A: Manual Desktop Encoding (Recommended for < 500 cards)

This method allows the core team to encode cards in-house using a simple USB device.

**Requirements:**

- **Hardware:** ACR122U USB NFC Writer (~$30 USD).
- **Software:** "GoToTags Windows App" or "NFC Tools for Desktop".
- **Data:** A CSV file containing the list of generated URLs.

**Workflow:**

1.  **Generate UUIDs:** Run the script (below) to generate 500 unique IDs.
2.  **Load Software:** Import the generated CSV into the encoding software.
3.  **The "Tap Assembly Line":**
    - Person A: Hands blank card.
    - Person B: Taps card on reader -> _Beep! (Written)_.
    - Person B: Places card in "Finished" pile.

### Option B: Factory Encoding (Recommended for > 500 cards)

This method outsources the work to the card printing vendor.

**Workflow:**

1.  **Generate Excel Sheet:** Create a spreadsheet with:
    - `PRINT_ID`: The human-readable ID (e.g., GDG-001).
    - `NFC_URL`: The specific payload (e.g., https://gdgpup.org/sparkmates/usr_123?source=nfc_card).
2.  **Send to Vendor:** Email this file along with the artwork.
3.  **Receive:** The vendor ships boxes of cards that are already programmed.

---

## 3. Data Generation & Database Sync (The "Pre-Activated" State)

It is critical that every physical card corresponds to a row in our database. During the encoding period, these cards exist in the system but belong to **no one**.

### The Database State (`nfc_cards` Table)

Before you write to the physical cards, your database table must be populated like this:

| card_id (UUID) | gdg_id (FK) | status  | activated_at |
| :------------- | :----------- | :------ | :----------- |
| `a1b2-c3d4...` | **`usr_12`** | `issued`| `NULL`       |
| `e5f6-g7h8...` | **`usr_34`** | `issued`| `NULL`       |

- **id:** The unique UUID burned into the card.
- **gdg_id:** Must be pre-assigned to a valid member.
- **status:** Must be exactly `"issued"`.

### Generation Script (Node.js Example)

This script generates the IDs in code (Client-Side) and pushes them to _both_ the CSV file and the Database. Not relying on DB auto-generation ensures perfect sync.

```javascript
/*
  Prerequisites: 
  npm install @supabase/supabase-js uuid fs
*/

import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Initialize Supabase (Use Service Role Key to bypass RLS)
const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SERVICE_ROLE_KEY");

const BATCH_SIZE = 100; // How many cards are we making?
const BASE_URL = "https://gdgpup.org/sparkmates";

let csvContent = "NFC_URL\n";
const dbRecords = [];

console.log(`Generating ${BATCH_SIZE} unique cards...`);

for (let i = 0; i < BATCH_SIZE; i++) {
  const id = uuidv4(); // Generate ID here, not in DB

  const gdgId = `usr_${Math.floor(Math.random() * 90000) + 10000}`; // Example GDG ID logic

  // 1. For the Physical Card (CSV)
  const fullUrl = `${BASE_URL}/${gdgId}?source=nfc_card`;
  csvContent += `${fullUrl}\n`;

  // 2. For the Database (Pre-Fill)
  // We explicitly set the 'id' here to formally register the minted UUID
  // NOTE: In production, gdg_id MUST be assigned correctly to target users
  dbRecords.push({
    id: id,
    gdg_id: gdgId, // Must link to actual member's GDG ID
    status: "issued", // Ready for activation verification
    activated_at: null
  });
}

async function syncToDatabase() {
  // Write CSV File
  fs.writeFileSync("nfc_production_data.csv", csvContent);
  console.log("✅ CSV File Created: nfc_production_data.csv");

  // Bulk Insert to Database
  const { data, error } = await supabase.from("nfc_cards").insert(dbRecords);

  if (error) {
    console.error("❌ Database Sync Failed:", error.message);
  } else {
    console.log("✅ Database Synced Successfully!");
    console.log("You can now load the CSV into your NFC Writer software.");
  }
}

syncToDatabase();
```

---

## 4. Quality Control (QC)

Regardless of the method, **test your batch!**

- **Random Sampling:** Pick 5 cards from every box.
- **Scan Check:** Tap them on a phone. Do they open the **Activation Page**?
- **Lock Status:** Ensure the cards are **Locked (Read-Only)** after writing so users cannot accidentally overwrite them.
