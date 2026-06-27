import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { updateAdminOrderStatus } from "@/lib/admin/data";
import { isOrderStatus, isPaymentStatus } from "@/lib/admin/statuses";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const user = await getAdminUser();
  if (!user) return errorResponse("Admin access is required.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Please choose valid order and payment statuses.", 400);
  }

  const input = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const orderStatus = readText(input.orderStatus);
  const paymentStatus = readText(input.paymentStatus);

  if (!isOrderStatus(orderStatus) || !isPaymentStatus(paymentStatus)) {
    return errorResponse("Please choose valid order and payment statuses.", 400);
  }

  try {
    await updateAdminOrderStatus((await params).orderNumber, orderStatus, paymentStatus);
    return NextResponse.json({ ok: true });
  } catch {
    return errorResponse("Could not update this order. Please try again.", 500);
  }
}
