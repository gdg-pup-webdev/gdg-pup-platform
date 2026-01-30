import { createClient } from "@supabase/supabase-js";
import { configs } from "@/configs/configs";

export const supabase = createClient(configs.supabaseUrl, configs.supabaseKey);
