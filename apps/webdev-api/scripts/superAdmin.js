import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Initialize Firebase Admin
const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

const adminAuth = getAuth(app);

// Create readline interface (promise-based)
const rl = readline.createInterface({ input, output });

// --- Functions ---

async function assignRole() {
  const uid = await rl.question("Enter UID: ");
  const role = await rl.question("Enter Role: ");
  await adminAuth.setCustomUserClaims(uid, { role });
  console.log(`✅ Role '${role}' assigned successfully to ${uid}.\n`);
}

async function checkRole() {
  const uid = await rl.question("Enter UID: ");
  const user = await adminAuth.getUser(uid);
  console.log("👤 Role:", user.customClaims?.role || "No role assigned.\n");
}

async function start() {
  console.log("=== 🔐 SuperAdmin Console ===");

  while (true) {
    console.log("\n1. Assign Role");
    console.log("2. Check Role");
    console.log("3. Exit");

    const choice = await rl.question("Enter your choice: ");

    if (choice === "1") {
      await assignRole();
    } else if (choice === "2") {
      await checkRole();
    } else if (choice === "3") {
      console.log("👋 Exiting...");
      rl.close();
      break;
    } else {
      console.log("❌ Invalid choice. Please try again.\n");
    }
  }
}

// Start the CLI
start();
