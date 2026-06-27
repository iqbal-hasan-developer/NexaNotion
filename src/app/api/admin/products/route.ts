import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { parseProductInput } from "@/lib/admin/input";
import { saveAdminProduct } from "@/lib/admin/data";

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return jsonError("Admin access is required.", 401);

  try {
    const input = parseProductInput(await request.json());
    const slug = await saveAdminProduct(input);
    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save product.", 400);
  }
}
