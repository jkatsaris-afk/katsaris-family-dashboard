import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://memwyozsekoaeflhvits.supabase.co";
const supabaseKey = "sb_publishable_nHVjzCIZJBX3nXKaIBhZ2g_-OzYqP_P";

export const supabase = createClient(supabaseUrl, supabaseKey);
