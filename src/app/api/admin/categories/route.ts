import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { saveAdminCategory } from "@/lib/admin/data";
import { parseCategoryInput } from "@/lib/admin/input";

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return jsonError("Admin access is required.", 401);

  try {
    const input = parseCategoryInput(await request.json());
    const slug = await saveAdminCategory(input);
    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save category.", 400);
  }
}
