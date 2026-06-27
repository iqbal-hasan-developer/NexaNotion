import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAllowedAdminEmail } from "@/lib/admin/auth";
import { adminAccessCookie } from "@/lib/admin/constants";
import { getPublicSupabaseEnv, isSupabasePublicConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/database";

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  if (!isSupabasePublicConfigured()) {
    return errorResponse("Admin login is not configured yet.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Please enter your admin email and password.", 400);
  }

  const input = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const email = readText(input.email).toLowerCase();
  const password = readText(input.password);

  if (!email || !password) {
    return errorResponse("Please enter your admin email and password.", 400);
  }

  const { url, anonKey } = getPublicSupabaseEnv();
  const supabase = createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  const userEmail = data.user?.email ?? email;

  if (error || !data.session?.access_token) {
    return errorResponse("Invalid admin email or password.", 401);
  }

  if (!isAllowedAdminEmail(userEmail)) {
    await supabase.auth.signOut();
    return errorResponse("This account is not allowed to access the admin panel.", 403);
  }

  const response = NextResponse.json({ ok: true, email: userEmail });
  response.cookies.set(adminAccessCookie, data.session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: data.session.expires_in,
  });

  return response;
}
