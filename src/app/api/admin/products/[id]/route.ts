import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { parseProductInput, readBoolean } from "@/lib/admin/input";
import { saveAdminProduct, setAdminProductActive } from "@/lib/admin/data";

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
    return jsonError("Please check the product details.", 400);
  }

  try {
    const { id } = await params;
    const bodyRecord = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

    if (bodyRecord.action === "status") {
      await setAdminProductActive(id, readBoolean(bodyRecord.isActive));
      return NextResponse.json({ ok: true });
    }

    const input = parseProductInput(body);
    const slug = await saveAdminProduct(input, id);
    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save product.", 400);
  }
}
