import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { saveAdminCategory, setAdminCategoryActive } from "@/lib/admin/data";
import { parseCategoryInput, readBoolean } from "@/lib/admin/input";

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return jsonError("Admin access is required.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Please check the category details.", 400);
  }

  try {
    const { id } = await params;
    const bodyRecord = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

    if (bodyRecord.action === "status") {
      await setAdminCategoryActive(id, readBoolean(bodyRecord.isActive));
      return NextResponse.json({ ok: true });
    }

    const input = parseCategoryInput(body);
    const slug = await saveAdminCategory(input, id);
    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save category.", 400);
  }
}
