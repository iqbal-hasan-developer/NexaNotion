import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { sendAdminOrderNotification } from "@/lib/notifications/email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { ApiErrorResponse, CreateOrderInput, CreateOrderResponse, PaymentMethod } from "@/types";

const paymentMethods = new Set<PaymentMethod>(["cod", "bkash", "nagad"]);
const friendlyError = "Something went wrong. Please try again or message us on WhatsApp.";

type ValidatedOrderInput = Omit<CreateOrderInput, "customerNote" | "paymentTransactionId"> & {
  customerNote: string;
  paymentTransactionId: string | null;
};

function errorResponse(error: string, status: number, code: ApiErrorResponse["code"]) {
  return NextResponse.json<ApiErrorResponse>({ error, code }, { status });
}

function readText(value: FormDataEntryValue | unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeQuantity(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 99 ? value : null;
}

function validateOrderInput(value: unknown): ValidatedOrderInput | ApiErrorResponse {
  if (!value || typeof value !== "object") return { error: "Please complete the order form.", code: "VALIDATION_ERROR" };

  const input = value as Record<string, unknown>;
  const customerName = readText(input.customerName);
  const customerPhone = readText(input.customerPhone);
  const customerAddress = readText(input.customerAddress);
  const deliveryArea = readText(input.deliveryArea);
  const customerNote = readText(input.customerNote);
  const paymentMethod = readText(input.paymentMethod) as PaymentMethod;
  const rawPaymentTransactionId = readText(input.paymentTransactionId);
  const rawItems = Array.isArray(input.items) ? input.items : [];

  if (!customerName || !customerPhone || !customerAddress || !deliveryArea) {
    return { error: "Please complete your delivery details.", code: "VALIDATION_ERROR" };
  }

  if (!paymentMethods.has(paymentMethod)) {
    return { error: "Please choose a payment method.", code: "VALIDATION_ERROR" };
  }

  const isManualPayment = paymentMethod === "bkash" || paymentMethod === "nagad";
  const paymentTransactionId = isManualPayment ? rawPaymentTransactionId : null;
  if (isManualPayment && rawPaymentTransactionId.length < 4) {
    return { error: "Please enter a valid Transaction ID for your manual payment.", code: "VALIDATION_ERROR" };
  }

  const items = rawItems.map((item) => {
    const itemRecord = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const slug = readText(itemRecord.slug);
    const quantity = normalizeQuantity(itemRecord.quantity);
    return slug && quantity ? { slug, quantity } : null;
  });

  if (!items.length || items.some((item) => item === null)) {
    return { error: "Please add valid items before checkout.", code: "VALIDATION_ERROR" };
  }

  return {
    customerName,
    customerPhone,
    customerAddress,
    deliveryArea,
    customerNote,
    paymentMethod,
    paymentTransactionId,
    items: items.filter((item): item is { slug: string; quantity: number } => Boolean(item)),
  };
}

function getManualPaymentDetails(paymentMethod: PaymentMethod) {
  if (paymentMethod === "bkash" || paymentMethod === "nagad") {
    return siteConfig.manualPayments[paymentMethod];
  }

  return null;
}

function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `NN-${date}-${suffix}`;
}

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return errorResponse(friendlyError, 503, "BACKEND_NOT_CONFIGURED");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Please check your order details and try again.", 400, "VALIDATION_ERROR");
  }

  const validated = validateOrderInput(body);
  if ("error" in validated) {
    return errorResponse(validated.error, 400, validated.code);
  }

  const supabase = createSupabaseAdminClient();
  const requestedSlugs = [...new Set(validated.items.map((item) => item.slug))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,name,slug,price,image_url,is_active,stock,inventory_tracking")
    .eq("is_active", true)
    .in("slug", requestedSlugs);

  if (productsError) {
    return errorResponse(friendlyError, 500, "SERVER_ERROR");
  }

  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const missingProduct = validated.items.find((item) => !productBySlug.has(item.slug));

  if (missingProduct) {
    return errorResponse("One of the selected products is no longer available.", 400, "VALIDATION_ERROR");
  }

  const unavailableItem = validated.items.find((item) => {
    const product = productBySlug.get(item.slug);
    return product?.inventory_tracking !== false && (product?.stock ?? 0) < item.quantity;
  });

  if (unavailableItem) {
    return errorResponse("One of the selected products does not have enough stock.", 400, "VALIDATION_ERROR");
  }

  const lineItems = validated.items.map((item) => {
    const product = productBySlug.get(item.slug);
    if (!product) throw new Error("Product validation failed.");
    const unitPrice = Number(product.price);
    const lineTotal = unitPrice * item.quantity;

    return {
      product,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryCharge = siteConfig.deliveryCharge;
  const total = subtotal + deliveryCharge;
  const manualPayment = getManualPaymentDetails(validated.paymentMethod);
  const paymentStatus = manualPayment ? "pending" : "unpaid";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const orderNumber = generateOrderNumber();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: validated.customerName,
        customer_phone: validated.customerPhone,
        customer_address: validated.customerAddress,
        delivery_area: validated.deliveryArea,
        customer_note: validated.customerNote || null,
        payment_method: validated.paymentMethod,
        payment_status: paymentStatus,
        payment_transaction_id: manualPayment ? validated.paymentTransactionId : null,
        payment_number: manualPayment?.number ?? null,
        order_status: "pending",
        subtotal,
        delivery_charge: deliveryCharge,
        total,
      })
      .select("id,order_number,total,order_status,payment_status")
      .single();

    if (orderError?.code === "23505") continue;
    if (orderError || !order) {
      return errorResponse(friendlyError, 500, "SERVER_ERROR");
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      lineItems.map(({ product, quantity, unitPrice, lineTotal }) => ({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        product_image_url: product.image_url,
        unit_price: unitPrice,
        quantity,
        line_total: lineTotal,
      })),
    );

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return errorResponse(friendlyError, 500, "SERVER_ERROR");
    }

    const decremented: { id: string; stock: number }[] = [];
    for (const { product, quantity } of lineItems) {
      if (product.inventory_tracking === false) continue;
      const { data: decrementedOk, error: stockError } = await supabase.rpc("decrement_product_stock", {
        product_id: product.id,
        requested_quantity: quantity,
      });

      if (stockError || !decrementedOk) {
        await Promise.all(decremented.map((item) => supabase.from("products").update({ stock: item.stock }).eq("id", item.id)));
        await supabase.from("orders").delete().eq("id", order.id);
        return errorResponse("One of the selected products does not have enough stock.", 400, "VALIDATION_ERROR");
      }

      decremented.push({ id: product.id, stock: Number(product.stock ?? 0) });
    }

    await sendAdminOrderNotification({
      orderNumber: order.order_number,
      total: Number(order.total),
      paymentMethod: validated.paymentMethod,
      paymentStatus: order.payment_status,
      items: lineItems.map(({ product, quantity, lineTotal }) => ({ name: product.name, quantity, lineTotal })),
    });

    return NextResponse.json<CreateOrderResponse>({
      orderNumber: order.order_number,
      total: Number(order.total),
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      paymentMethod: validated.paymentMethod,
    });
  }

  return errorResponse(friendlyError, 500, "SERVER_ERROR");
}
