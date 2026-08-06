import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./admin-config.js";

export const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);