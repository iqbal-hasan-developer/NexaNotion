import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { ApiErrorResponse, TrackingResponse } from "@/types";

const friendlyError = "Something went wrong. Please try again or message us on WhatsApp.";

function errorResponse(error: string, status: number, code: ApiErrorResponse["code"]) {
  return NextResponse.json<ApiErrorResponse>({ error, code }, { status });
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return errorResponse(friendlyError, 503, "BACKEND_NOT_CONFIGURED");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Please enter your order number and phone number.", 400, "VALIDATION_ERROR");
  }

  const input = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const orderNumber = readText(input.orderNumber).toUpperCase();
  const phone = readText(input.phone);

  if (!orderNumber || !phone) {
    return errorResponse("Please enter your order number and phone number.", 400, "VALIDATION_ERROR");
  }

  const supabase = createSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id,order_number,order_status,payment_status,payment_method,created_at,subtotal,delivery_charge,total")
    .eq("order_number", orderNumber)
    .eq("customer_phone", phone)
    .maybeSingle();

  if (orderError) {
    return errorResponse(friendlyError, 500, "SERVER_ERROR");
  }

  if (!order) {
    return errorResponse("We could not find that order. Please check your order number and phone number.", 404, "NOT_FOUND");
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_name,product_slug,product_image_url,unit_price,quantity,line_total")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    return errorResponse(friendlyError, 500, "SERVER_ERROR");
  }

  return NextResponse.json<TrackingResponse>({
    orderNumber: order.order_number,
    orderStatus: order.order_status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    createdAt: order.created_at ?? new Date().toISOString(),
    subtotal: Number(order.subtotal),
    deliveryCharge: Number(order.delivery_charge),
    total: Number(order.total),
    items: items.map((item) => ({
      productName: item.product_name,
      productSlug: item.product_slug,
      productImageUrl: item.product_image_url ?? undefined,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    })),
  });
}
