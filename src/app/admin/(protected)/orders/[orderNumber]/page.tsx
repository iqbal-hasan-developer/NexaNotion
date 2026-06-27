import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, MapPin, Phone } from "lucide-react";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { StatusBadge, formatAdminLabel } from "@/components/admin/status-badge";
import { CopyButton } from "@/components/ui/copy-button";
import { getAdminOrderDetail } from "@/lib/admin/data";
import { formatPrice } from "@/lib/utils";

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getAdminOrderDetail(orderNumber);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted transition hover:text-brand-purple">
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Order detail</p>
                <h1 className="mt-2 text-3xl font-black">{order.orderNumber}</h1>
                <p className="mt-2 text-sm text-brand-muted">Placed {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt))}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={order.orderStatus} />
                <StatusBadge value={order.paymentMethod} />
                <StatusBadge value={order.paymentStatus} />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">Customer</h2>
              <p className="mt-4 font-black">{order.customerName}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-brand-muted"><Phone className="size-4" />{order.customerPhone}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-brand-muted"><MapPin className="size-4" />{order.deliveryArea}</p>
            </div>
            <div className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">Delivery address</h2>
              <p className="mt-4 text-sm leading-6 text-brand-muted">{order.customerAddress}</p>
              {order.customerNote ? <p className="mt-4 rounded-xl bg-brand-soft p-3 text-sm leading-6 text-brand-muted">{order.customerNote}</p> : null}
            </div>
          </section>

          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.productSlug} className="grid gap-3 rounded-xl border border-brand-navy/8 p-4 sm:grid-cols-[minmax(0,1fr)_90px_120px_120px] sm:items-center">
                  <div>
                    <p className="font-black">{item.productName}</p>
                    <p className="mt-1 text-sm text-brand-muted">{item.productSlug}</p>
                  </div>
                  <p className="text-sm"><span className="text-brand-muted sm:hidden">Qty: </span>{item.quantity}</p>
                  <p className="text-sm"><span className="text-brand-muted sm:hidden">Unit: </span>Tk {formatPrice(item.unitPrice)}</p>
                  <p className="font-black"><span className="text-brand-muted sm:hidden">Line: </span>Tk {formatPrice(item.lineTotal)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-brand-purple" />
              <h2 className="text-lg font-black">Manual Payment Details</h2>
            </div>
            {order.paymentMethod === "cod" ? (
              <p className="mt-4 rounded-xl bg-brand-soft p-3 text-sm font-semibold leading-6 text-brand-muted">
                No transaction ID required for Cash on Delivery.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">Payment method</dt>
                    <dd className="font-black">{formatAdminLabel(order.paymentMethod)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">Payment number</dt>
                    <dd className="font-black tracking-normal">{order.paymentNumber ?? "Not stored"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-muted">Payment status</dt>
                    <dd><StatusBadge value={order.paymentStatus} /></dd>
                  </div>
                </dl>
                <div className="rounded-xl border border-brand-purple/15 bg-brand-soft p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-purple">Transaction ID</p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="break-all text-lg font-black tracking-normal text-brand-navy">{order.paymentTransactionId ?? "Not submitted"}</p>
                    {order.paymentTransactionId ? <CopyButton value={order.paymentTransactionId} label="Copy Transaction ID" /> : null}
                  </div>
                </div>
              </div>
            )}
          </section>
          <OrderStatusForm orderNumber={order.orderNumber} initialOrderStatus={order.orderStatus} initialPaymentStatus={order.paymentStatus} />
          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Totals</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-brand-muted">Subtotal</dt><dd className="font-bold">Tk {formatPrice(order.subtotal)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-brand-muted">Delivery</dt><dd className="font-bold">Tk {formatPrice(order.deliveryCharge)}</dd></div>
              <div className="flex justify-between gap-4 border-t border-brand-navy/8 pt-4 text-lg"><dt className="font-black">Total</dt><dd className="font-black">Tk {formatPrice(order.total)}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
