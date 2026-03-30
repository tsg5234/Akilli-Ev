import "server-only";

import { createClient } from "@supabase/supabase-js";
import { assertSupabaseEnv, env } from "@/lib/env";

export function createAdminClient() {
  assertSupabaseEnv();

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
