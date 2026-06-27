import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { updateAdminMessageStatus } from "@/lib/admin/data";
import { isMessageStatus } from "@/lib/admin/statuses";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return errorResponse("Admin access is required.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Please choose a valid message status.", 400);
  }

  const input = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const status = readText(input.status);

  if (!isMessageStatus(status)) {
    return errorResponse("Please choose a valid message status.", 400);
  }

  try {
    await updateAdminMessageStatus((await params).id, status);
    return NextResponse.json({ ok: true });
  } catch {
    return errorResponse("Could not update this message. Please try again.", 500);
  }
}
