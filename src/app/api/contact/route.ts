import { NextResponse } from "next/server";
import { sendAdminContactNotification } from "@/lib/notifications/email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { ApiErrorResponse, ContactInput } from "@/types";

const friendlyError = "Something went wrong. Please try again or message us on WhatsApp.";

function errorResponse(error: string, status: number, code: ApiErrorResponse["code"]) {
  return NextResponse.json<ApiErrorResponse>({ error, code }, { status });
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactInput(value: unknown): ContactInput | ApiErrorResponse {
  if (!value || typeof value !== "object") return { error: "Please complete your message.", code: "VALIDATION_ERROR" };

  const input = value as Record<string, unknown>;
  const name = readText(input.name);
  const phone = readText(input.phone);
  const email = readText(input.email);
  const subject = readText(input.subject);
  const message = readText(input.message);

  if (!name || !message) {
    return { error: "Please add your name and message.", code: "VALIDATION_ERROR" };
  }

  return { name, phone, email, subject, message };
}

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return errorResponse(friendlyError, 503, "BACKEND_NOT_CONFIGURED");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Please complete your message.", 400, "VALIDATION_ERROR");
  }

  const validated = validateContactInput(body);
  if ("error" in validated) {
    return errorResponse(validated.error, 400, validated.code);
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: validated.name,
    phone: validated.phone || null,
    email: validated.email || null,
    subject: validated.subject || null,
    message: validated.message,
    status: "new",
  });

  if (error) {
    return errorResponse(friendlyError, 500, "SERVER_ERROR");
  }

  await sendAdminContactNotification(validated);

  return NextResponse.json({ ok: true });
}
