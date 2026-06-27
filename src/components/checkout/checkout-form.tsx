"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Check, CheckCircle2, Copy, Landmark, ShoppingBag, Smartphone } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CopyButton } from "@/components/ui/copy-button";
import { siteConfig } from "@/config/site";
import { trackMetaEvent } from "@/lib/meta-pixel-client";
import { formatPrice } from "@/lib/utils";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/public-env";
import type { ApiErrorResponse, CreateOrderResponse, PaymentMethod } from "@/types";

const fallbackConfirmation: CreateOrderResponse = {
  orderNumber: "NN-ORDER-2026",
  total: 0,
  orderStatus: "pending",
  paymentStatus: "unpaid",
  paymentMethod: "cod",
};

const paymentOptions = [
  { value: "cod", icon: Banknote, label: "Cash on Delivery", copy: "Pay in cash when your order arrives." },
  { value: "bkash", icon: Smartphone, label: "Manual bKash", copy: "Send Money first, then submit your Transaction ID with the order." },
  { value: "nagad", icon: Landmark, label: "Manual Nagad", copy: "Send Money first, then submit your Transaction ID with the order." },
] as const;

export function CheckoutForm() {
  const { items, subtotal, hydrated, clearCart } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [confirmation, setConfirmation] = useState<CreateOrderResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [copiedPayment, setCopiedPayment] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const checkoutTrackedRef = useRef(false);
  const delivery = items.length ? siteConfig.deliveryCharge : 0;
  const selectedPayment = paymentOptions.find((option) => option.value === payment) ?? paymentOptions[0];
  const manualPayment = payment === "bkash" || payment === "nagad" ? siteConfig.manualPayments[payment] : null;

  useEffect(() => {
    if (confirmation) {
      confirmationRef.current?.scrollIntoView({ block: "start" });
    }
  }, [confirmation]);

  useEffect(() => {
    if (!hydrated || checkoutTrackedRef.current) return;
    checkoutTrackedRef.current = true;
    trackMetaEvent("InitiateCheckout", {
      content_ids: items.map((item) => item.slug),
      contents: items.map((item) => ({ id: item.slug, quantity: item.quantity })),
      content_type: "product",
      currency: "BDT",
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value: subtotal + delivery,
    });
  }, [delivery, hydrated, items, subtotal]);

  if (!hydrated) return <div className="h-72 animate-pulse rounded-[2rem] bg-brand-soft" />;

  if (confirmation) {
    const trackOrderHref = `/track-order?order=${encodeURIComponent(confirmation.orderNumber)}`;

    return (
      <div ref={confirmationRef} className="soft-enter mx-auto max-w-3xl rounded-[2rem] border border-brand-navy/8 bg-white px-5 py-10 text-center shadow-[0_22px_70px_rgba(5,10,31,0.06)] sm:px-8 sm:py-14">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-lavender text-brand-purple">
          <CheckCircle2 className="size-9" />
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-purple">Order request received</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight">Thank you. Your order details are ready for review.</h2>
        <p className="mt-3 leading-7 text-brand-muted">
          Your order details are reviewed before processing. For urgent help, message us on WhatsApp.
        </p>
        {confirmation.paymentMethod !== "cod" ? (
          <p className="soft-enter mx-auto mt-4 max-w-lg rounded-2xl bg-brand-soft p-4 text-sm font-semibold leading-6 text-brand-navy">
            Your transaction ID has been submitted. Payment will be manually verified before processing.
          </p>
        ) : null}
        <div className="soft-enter mx-auto mt-7 max-w-2xl rounded-[1.5rem] border border-brand-purple/18 bg-gradient-to-br from-white via-brand-soft to-brand-lavender/60 p-5 text-left shadow-[0_16px_42px_rgba(91,33,232,0.1)] sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Your Order Number</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="break-all text-2xl font-black tracking-normal text-brand-navy min-[420px]:text-3xl sm:text-4xl">{confirmation.orderNumber}</p>
            <CopyButton
              value={confirmation.orderNumber}
              label="Copy Order Number"
              ariaLabel={`Copy order number ${confirmation.orderNumber}`}
              className="min-h-12 rounded-full px-5"
            />
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-brand-muted">Save this order number to track your order later.</p>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={siteConfig.whatsappHref} className="motion-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(91,33,232,0.24)] transition hover:-translate-y-0.5">
            Confirm on WhatsApp <ArrowRight className="size-4" />
          </Link>
          <Link href={trackOrderHref} className="motion-press inline-flex min-h-12 items-center justify-center rounded-full border border-brand-blue/20 bg-white px-6 text-sm font-semibold text-brand-navy transition hover:border-brand-purple/40 hover:bg-brand-lavender/40">Track Order</Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-brand-navy/8 bg-white px-6 py-14 text-center shadow-[0_22px_70px_rgba(5,10,31,0.06)] sm:px-10 sm:py-16">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-lavender text-brand-purple">
          <ShoppingBag className="size-8" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-brand-navy">Your cart is empty.</h2>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-brand-muted">Add your favorite NexaNotion items before completing checkout.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(91,33,232,0.24)] transition hover:-translate-y-0.5">
            Continue Shopping <ArrowRight className="size-4" />
          </Link>
          <Link href="/cart" className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-blue/20 bg-white px-6 text-sm font-extrabold text-brand-navy transition hover:border-brand-purple/40 hover:bg-brand-lavender/40">Review Cart</Link>
        </div>
      </div>
    );
  }

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    const paymentTransactionId = String(formData.get("paymentTransactionId") ?? "").trim();
    const isManualPayment = payment === "bkash" || payment === "nagad";

    setTransactionError("");
    if (isManualPayment && paymentTransactionId.length < 4) {
      setTransactionError("Please enter a valid Transaction ID with at least 4 characters.");
      setError("Please enter your manual payment Transaction ID before placing the order.");
      return;
    }

    const payload = {
      customerName: String(formData.get("name") ?? "").trim(),
      customerPhone: String(formData.get("phone") ?? "").trim(),
      customerAddress: String(formData.get("address") ?? "").trim(),
      deliveryArea: String(formData.get("area") ?? "").trim(),
      customerNote: String(formData.get("note") ?? "").trim(),
      paymentMethod: payment,
      paymentTransactionId: isManualPayment ? paymentTransactionId : undefined,
      items: items.map(({ slug, quantity }) => ({ slug, quantity })),
    };

    setSubmitting(true);
    setError("");

    if (!hasSupabaseBrowserEnv()) {
      setConfirmation({ ...fallbackConfirmation, total: subtotal + delivery, paymentMethod: payment, paymentStatus: isManualPayment ? "pending" : "unpaid" });
      clearCart();
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as CreateOrderResponse | ApiErrorResponse;

      if (!response.ok) {
        if ("code" in data && data.code === "BACKEND_NOT_CONFIGURED") {
          setConfirmation({ ...fallbackConfirmation, total: subtotal + delivery, paymentMethod: payment, paymentStatus: isManualPayment ? "pending" : "unpaid" });
          clearCart();
          return;
        }

        setError("error" in data ? data.error : "Something went wrong. Please try again or message us on WhatsApp.");
        return;
      }

      const confirmationData = data as CreateOrderResponse;
      trackMetaEvent("Purchase", {
        content_ids: items.map((item) => item.slug),
        contents: items.map((item) => ({ id: item.slug, quantity: item.quantity })),
        content_type: "product",
        currency: "BDT",
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        payment_method: payment,
        value: confirmationData.total,
      });
      setConfirmation(confirmationData);
      clearCart();
    } catch {
      setError("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={placeOrder} className="grid gap-8 pb-24 md:pb-0 lg:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-6">
        <section className="soft-enter rounded-[1.75rem] border border-brand-navy/8 bg-white p-5 shadow-[0_18px_55px_rgba(5,10,31,0.055)] sm:p-8">
          <h2 className="text-2xl font-extrabold text-brand-navy">Delivery Details</h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">Share where you would like your NexaNotion order delivered. We review details before processing.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" placeholder="Your full name" autoComplete="name" />
            <Field label="Phone" name="phone" placeholder="Your phone number" inputMode="tel" autoComplete="tel" />
            <label className="text-sm font-semibold text-brand-navy sm:col-span-2">Address<textarea name="address" required rows={4} placeholder="House, road, area and district" className="mt-2 w-full scroll-mb-28 rounded-2xl border border-brand-navy/10 bg-brand-soft px-4 py-3 font-normal outline-none transition focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>
            <label className="text-sm font-semibold text-brand-navy">Delivery Area<select name="area" required className="mt-2 min-h-12 w-full scroll-mb-28 rounded-full border border-brand-navy/10 bg-brand-soft px-4 font-normal outline-none transition focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender"><option value="">Select area</option>{siteConfig.deliveryAreas.map((area) => <option key={area}>{area}</option>)}</select></label>
            <Field label="Order Note" name="note" placeholder="Optional note" required={false} />
          </div>
        </section>

        <section className="soft-enter rounded-[1.75rem] border border-brand-navy/8 bg-white p-5 shadow-[0_18px_55px_rgba(5,10,31,0.055)] sm:p-8">
          <h2 className="text-2xl font-extrabold text-brand-navy">Payment Preference</h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">Choose your preferred option. Manual bKash/Nagad payments are checked by our team before processing.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {paymentOptions.map(({ value, icon: Icon, label, copy }) => (
              <label key={value} className={`motion-card cursor-pointer rounded-[1.15rem] border p-4 ${payment === value ? "border-brand-purple bg-brand-lavender/50 shadow-[0_10px_30px_rgba(91,33,232,0.1)]" : "border-brand-navy/10 hover:border-brand-purple/25"}`}>
                <input type="radio" name="payment" value={value} checked={payment === value} onChange={() => { setPayment(value); setTransactionError(""); setError(""); }} className="sr-only" />
                <Icon className="size-5 text-brand-purple" />
                <span className="mt-3 block text-sm font-semibold">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-brand-muted">{copy}</span>
              </label>
            ))}
          </div>
          {manualPayment ? (
            <div className="soft-enter mt-5 rounded-[1.25rem] border border-brand-purple/18 bg-gradient-to-br from-white via-brand-soft to-brand-lavender/55 p-4 shadow-[0_14px_36px_rgba(91,33,232,0.08)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-purple">{manualPayment.label} Send Money</p>
                  <p className="mt-2 text-2xl font-black tracking-normal text-brand-navy">{manualPayment.number}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(manualPayment.number);
                      setCopiedPayment(true);
                      window.setTimeout(() => setCopiedPayment(false), 1600);
                    } catch {
                      setCopiedPayment(false);
                    }
                  }}
                  className="motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-purple/20 bg-white px-4 text-sm font-black text-brand-purple transition hover:bg-brand-lavender/60"
                >
                  {copiedPayment ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copiedPayment ? "Copied" : "Copy number"}
                </button>
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-brand-navy">
                Send Money to {manualPayment.number} via {manualPayment.label}, then enter your Transaction ID below.
              </p>
              <label className="mt-4 block text-sm font-semibold text-brand-navy">
                Transaction ID
                <input
                  name="paymentTransactionId"
                  required
                  minLength={4}
                  placeholder="Enter your bKash/Nagad transaction ID"
                  className={`mt-2 min-h-12 w-full scroll-mb-28 rounded-2xl border bg-white px-4 font-normal outline-none transition focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender ${transactionError ? "border-rose-300 ring-4 ring-rose-50" : "border-brand-navy/10"}`}
                />
              </label>
              {transactionError ? <p className="mt-2 text-sm font-semibold text-rose-600">{transactionError}</p> : null}
              <p className="mt-3 text-xs font-semibold leading-5 text-brand-muted">Your payment will be manually checked before your order is processed.</p>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-brand-soft p-4 text-sm leading-6 text-brand-muted">{selectedPayment.copy}</p>
          )}
        </section>
      </div>

      <aside className="soft-enter h-fit rounded-[1.75rem] bg-brand-navy p-6 text-white shadow-[0_22px_64px_rgba(5,10,31,0.18)] lg:sticky lg:top-28">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/48">Order review</p>
        <h2 className="mt-2 text-2xl font-extrabold">Your Order</h2>
        <div className="mt-5 max-h-72 space-y-4 overflow-auto pr-1">
          {items.map(({ product, quantity }) => <div key={product.slug} className="flex justify-between gap-4 text-sm"><div><p className="font-medium leading-5">{product.name}</p><p className="mt-1 text-white/50">Qty {quantity}</p></div><p className="shrink-0 font-semibold">Tk {formatPrice((product.salePrice ?? product.price) * quantity)}</p></div>)}
        </div>
        <dl className="mt-6 space-y-3 border-t border-white/12 pt-5 text-sm">
          <div className="flex justify-between gap-4 text-white/70"><dt>Subtotal</dt><dd className="font-bold text-white">Tk {formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between gap-4 text-white/70"><dt>Delivery charge</dt><dd className="font-bold text-white">Tk {formatPrice(delivery)}</dd></div>
          <div className="flex items-end justify-between gap-4 border-t border-white/12 pt-5"><dt className="text-base font-bold text-white/82">Total</dt><dd className="text-3xl font-extrabold tracking-normal text-white">Tk {formatPrice(subtotal + delivery)}</dd></div>
        </dl>
        {error ? <p className="soft-enter mt-5 rounded-2xl bg-white/10 p-3 text-center text-sm leading-5 text-white">{error}</p> : null}
        <button type="submit" disabled={submitting} className="motion-press mt-7 min-h-[3.25rem] w-full scroll-mb-28 rounded-full bg-white px-6 text-sm font-extrabold text-brand-navy shadow-[0_16px_36px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-brand-lavender disabled:cursor-not-allowed disabled:opacity-70">{submitting ? "Placing Order..." : "Place Order Request"}</button>
        <p className="mt-3 text-center text-xs leading-5 text-white/58">Delivery charge will be confirmed before processing. Manual payments are verified by our team.</p>
      </aside>
    </form>
  );
}

function Field({ label, required = true, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="text-sm font-semibold text-brand-navy">{label}<input {...props} required={required} className="mt-2 min-h-12 w-full scroll-mb-28 rounded-full border border-brand-navy/10 bg-brand-soft px-4 font-normal outline-none transition focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>;
}
