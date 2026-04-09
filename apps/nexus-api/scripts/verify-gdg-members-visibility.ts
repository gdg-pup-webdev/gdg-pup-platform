import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in apps/nexus-api/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function pct(part: number, total: number): string {
  if (total === 0) return "0.00%";
  return `${((part / total) * 100).toFixed(2)}%`;
}

async function run(): Promise<void> {
  const totalRes = await supabase
    .from("gdg_members")
    .select("gdg_id", { count: "exact", head: true });
  const publicRes = await supabase
    .from("gdg_members")
    .select("gdg_id", { count: "exact", head: true })
    .eq("is_public", true);
  const privateRes = await supabase
    .from("gdg_members")
    .select("gdg_id", { count: "exact", head: true })
    .eq("is_public", false);
  const nullRes = await supabase
    .from("gdg_members")
    .select("gdg_id", { count: "exact", head: true })
    .is("is_public", null);

  const errors = [totalRes.error, publicRes.error, privateRes.error, nullRes.error].filter(Boolean);
  if (errors.length > 0) {
    for (const error of errors) {
      console.error("Supabase query error:", error?.message);
    }
    process.exit(1);
  }

  const total = totalRes.count || 0;
  const publicCount = publicRes.count || 0;
  const privateCount = privateRes.count || 0;
  const nullCount = nullRes.count || 0;

  const sampleRes = await supabase
    .from("gdg_members")
    .select("gdg_id,display_name,program,department")
    .eq("is_public", true)
    .order("display_name", { ascending: true, nullsFirst: false })
    .limit(5);

  if (sampleRes.error) {
    console.error("Supabase sample query error:", sampleRes.error.message);
    process.exit(1);
  }

  const maxSuggestedPool = Math.min(15, publicCount);

  console.log("GDG Member Visibility Summary");
  console.log("-----------------------------");
  console.log(`Total members:           ${total}`);
  console.log(`Public (is_public=true): ${publicCount} (${pct(publicCount, total)})`);
  console.log(`Private (false):         ${privateCount} (${pct(privateCount, total)})`);
  console.log(`Null visibility:         ${nullCount} (${pct(nullCount, total)})`);
  console.log("");
  console.log(`Max suggested pool now:  ${maxSuggestedPool} (cap: 15)`);
  console.log("");
  console.log("Sample public members:");

  for (const row of sampleRes.data || []) {
    console.log(
      `- ${row.gdg_id} | ${row.display_name || "(no display name)"} | ${row.program || "(no program)"} | ${row.department || "(no department)"}`,
    );
  }
}

run().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
