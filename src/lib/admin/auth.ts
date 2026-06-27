import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { adminAccessCookie } from "@/lib/admin/constants";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database";

export type AdminUser = {
  id: string;
  email: string;
};

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(adminAccessCookie)?.value;

  if (!accessToken) return null;

  try {
    const { url, anonKey } = getPublicSupabaseEnv();
    const supabase = createClient<Database>(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const { data, error } = await supabase.auth.getUser(accessToken);
    const email = data.user?.email ?? null;

    if (error || !data.user || !isAllowedAdminEmail(email)) {
      return null;
    }

    return { id: data.user.id, email: email ?? "" };
  } catch {
    return null;
  }
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
