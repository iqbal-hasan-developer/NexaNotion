import type { MessageStatus, OrderStatus, PaymentMethod, PaymentStatus } from "@/types";

const styles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  processing: "bg-purple-50 text-purple-700 ring-purple-200",
  shipped: "bg-sky-50 text-sky-700 ring-sky-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  unpaid: "bg-amber-50 text-amber-700 ring-amber-200",
  verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-rose-50 text-rose-700 ring-rose-200",
  refunded: "bg-slate-100 text-slate-700 ring-slate-200",
  new: "bg-purple-50 text-purple-700 ring-purple-200",
  read: "bg-blue-50 text-blue-700 ring-blue-200",
  replied: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
  cod: "bg-brand-soft text-brand-navy ring-brand-navy/10",
  bkash: "bg-pink-50 text-pink-700 ring-pink-200",
  nagad: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function formatAdminLabel(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StatusBadge({ value }: { value: OrderStatus | PaymentStatus | MessageStatus | PaymentMethod }) {
  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-black ring-1 transition-colors duration-200 ${styles[value] ?? "bg-brand-soft text-brand-muted ring-brand-navy/10"}`}>
      {formatAdminLabel(value)}
    </span>
  );
}
