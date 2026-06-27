"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Circle, PackageSearch } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/public-env";
import type { ApiErrorResponse, OrderStatus, TrackingResponse } from "@/types";

const statuses: Exclude<OrderStatus, "cancelled">[] = ["pending", "confirmed", "processing", "shipped", "delivered"];
const previewResult: TrackingResponse = {
  orderNumber: "NN-PREVIEW-2026",
  orderStatus: "processing",
  paymentStatus: "unpaid",
  paymentMethod: "cod",
  createdAt: new Date().toISOString(),
  subtotal: 0,
  deliveryCharge: siteConfig.deliveryCharge,
  total: siteConfig.deliveryCharge,
  items: [],
};

function formatStatus(status: string) {
  return status.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPaymentSummary(result: TrackingResponse) {
  if ((result.paymentMethod === "bkash" || result.paymentMethod === "nagad") && result.paymentStatus === "pending") {
    return "Payment submitted, waiting for manual verification.";
  }

  return `Payment: ${formatStatus(result.paymentStatus)}.`;
}

export function TrackingForm() {
  const searchParams = useSearchParams();
  const initialOrderNumber = (searchParams.get("order") ?? "").trim().slice(0, 80);
  const initialPhone = (searchParams.get("phone") ?? "").trim().slice(0, 40);
  const [result, setResult] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function trackOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      orderNumber: String(formData.get("order") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
    };

    setLoading(true);
    setError("");

    if (!hasSupabaseBrowserEnv()) {
      setResult(previewResult);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as TrackingResponse | ApiErrorResponse;

      if (!response.ok) {
        if ("code" in data && data.code === "BACKEND_NOT_CONFIGURED") {
          setResult(previewResult);
          return;
        }

        setResult(null);
        setError("error" in data ? data.error : "We could not find that order. Please check your order number and phone number.");
        return;
      }

      setResult(data as TrackingResponse);
    } catch {
      setResult(null);
      setError("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = result?.orderStatus === "cancelled" ? 0 : statuses.indexOf(result?.orderStatus ?? "pending");

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={trackOrder} className="soft-enter grid gap-4 rounded-[2rem] border border-brand-navy/8 bg-white p-5 shadow-[0_22px_70px_rgba(5,10,31,.09)] ring-1 ring-brand-navy/5 sm:grid-cols-2 sm:p-8">
        <div className="sm:col-span-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-purple">Order Lookup</p>
          <h2 className="mt-3 text-2xl font-bold text-brand-navy sm:text-3xl">Track your order</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">Use the order number you received after checkout and the phone number used for your order.</p>
        </div>
        <Field label="Order Number" id="order-number" name="order" placeholder="NN-20260626-1234" defaultValue={initialOrderNumber} />
        <Field label="Phone Number" id="phone-number" name="phone" placeholder="Your phone number" defaultValue={initialPhone} />
        <button type="submit" disabled={loading} className="motion-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,33,232,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"><PackageSearch className="size-4" />{loading ? "Checking..." : "Track Order"}</button>
        {error ? <p className="soft-enter rounded-2xl bg-brand-lavender/60 p-3 text-center text-sm font-semibold leading-5 text-brand-navy sm:col-span-2">{error}</p> : null}
        <p className="text-center text-xs leading-5 text-brand-muted sm:col-span-2">
          Tracking details will appear here after you submit your order information. Need help finding your order number?{" "}
          <Link href={siteConfig.whatsappHref} className="font-bold text-brand-purple hover:text-brand-blue">Contact us on WhatsApp.</Link>
        </p>
      </form>

      {result ? (
        <div className="soft-enter mt-8 rounded-[2rem] border border-brand-navy/8 bg-brand-soft p-5 shadow-[0_18px_50px_rgba(5,10,31,0.06)] sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-purple">Order {result.orderNumber}</p>
              <h2 className="mt-1 text-2xl font-bold">Your order is {formatStatus(result.orderStatus).toLowerCase()}.</h2>
              <p className="mt-2 text-sm leading-6 text-brand-muted">
                {formatPaymentSummary(result)} Placed on {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(result.createdAt))}.
              </p>
            </div>
            <span className="self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-navy shadow-sm">{formatStatus(result.orderStatus)}</span>
          </div>
          <ol className="stagger-children mt-8 grid gap-0 rounded-[1.5rem] bg-white p-5 shadow-inner sm:grid-cols-5 sm:p-6">
            {statuses.map((status, index) => {
              const done = index <= currentIndex && result.orderStatus !== "cancelled";
              return (
                <li key={status} className="relative flex gap-4 pb-7 sm:block sm:pb-0 sm:text-center">
                  <span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full shadow-sm ${done ? "bg-brand-gradient text-white" : "border border-brand-navy/15 bg-white text-brand-muted"}`}>{done ? <Check className="size-4" /> : <Circle className="size-3" />}</span>
                  <span className={`mt-2 block text-sm font-semibold sm:mt-3 ${done ? "text-brand-navy" : "text-brand-muted"}`}>{formatStatus(status)}</span>
                  {index < statuses.length - 1 ? <span className={`absolute bottom-0 left-[19px] top-10 w-px sm:left-[calc(50%+20px)] sm:right-[calc(-50%+20px)] sm:top-5 sm:h-px sm:w-auto ${index < currentIndex && result.orderStatus !== "cancelled" ? "bg-brand-purple" : "bg-brand-navy/12"}`} /> : null}
                </li>
              );
            })}
          </ol>
          <div className="mt-6 rounded-[1.5rem] bg-white p-5 shadow-inner">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div><span className="block text-brand-muted">Subtotal</span><strong>Tk {formatPrice(result.subtotal)}</strong></div>
              <div><span className="block text-brand-muted">Delivery</span><strong>Tk {formatPrice(result.deliveryCharge)}</strong></div>
              <div><span className="block text-brand-muted">Total</span><strong>Tk {formatPrice(result.total)}</strong></div>
            </div>
            {result.items.length ? (
              <div className="mt-5 space-y-3 border-t border-brand-navy/8 pt-4">
                {result.items.map((item) => (
                  <div key={item.productSlug} className="flex justify-between gap-4 text-sm">
                    <span><span className="font-semibold text-brand-navy">{item.productName}</span><span className="block text-brand-muted">Qty {item.quantity}</span></span>
                    <span className="font-bold">Tk {formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label htmlFor={props.id} className="text-sm font-semibold text-brand-navy">{label}<input {...props} required className="mt-2 min-h-12 w-full rounded-full border border-brand-navy/12 bg-white px-4 font-normal outline-none shadow-inner transition placeholder:text-brand-muted/70 focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>;
}
