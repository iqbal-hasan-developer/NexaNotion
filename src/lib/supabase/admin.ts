import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getAdminSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database";

export function createSupabaseAdminClient() {
  const { url, serviceRoleKey } = getAdminSupabaseEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
