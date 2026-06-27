import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { StatusBadge, formatAdminLabel } from "@/components/admin/status-badge";
import { getAdminOrders } from "@/lib/admin/data";
import { orderStatuses, paymentStatuses } from "@/lib/admin/statuses";
import { formatPrice } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ orderStatus?: string; paymentStatus?: string; q?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const orders = await getAdminOrders({ orderStatus: params.orderStatus, paymentStatus: params.paymentStatus, search: params.q });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Orders</p>
          <h1 className="mt-2 text-3xl font-black">Order management</h1>
          <p className="mt-2 text-sm text-brand-muted">Search, filter, and open orders for status updates.</p>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">{orders.length} orders</p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
        <label className="relative block">
          <span className="sr-only">Search orders</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-purple" />
          <input name="q" defaultValue={params.q ?? ""} placeholder="Search order number or phone" className="min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft pl-10 pr-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
        </label>
        <label>
          <span className="sr-only">Order status</span>
          <select name="orderStatus" defaultValue={params.orderStatus ?? ""} className="min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
            <option value="">All order statuses</option>
            {orderStatuses.map((status) => <option key={status} value={status}>{formatAdminLabel(status)}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Payment status</span>
          <select name="paymentStatus" defaultValue={params.paymentStatus ?? ""} className="min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
            <option value="">All payment statuses</option>
            {paymentStatuses.map((status) => <option key={status} value={status}>{formatAdminLabel(status)}</option>)}
          </select>
        </label>
        <button className="min-h-11 rounded-xl bg-brand-navy px-5 text-sm font-black text-white transition hover:bg-brand-purple">Apply</button>
      </form>

      <section className="hidden overflow-hidden rounded-2xl border border-brand-navy/8 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-brand-soft text-xs uppercase text-brand-muted">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Order status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-brand-navy/6">
                  <td className="px-4 py-4 font-black text-brand-purple">{order.orderNumber}</td>
                  <td className="px-4 py-4">{order.customerName}</td>
                  <td className="px-4 py-4">{order.customerPhone}</td>
                  <td className="px-4 py-4 font-bold">Tk {formatPrice(order.total)}</td>
                  <td className="px-4 py-4"><StatusBadge value={order.orderStatus} /></td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge value={order.paymentMethod} />
                      <StatusBadge value={order.paymentStatus} />
                      {order.paymentMethod !== "cod" && order.hasPaymentTransactionId ? <span className="text-xs font-bold text-brand-muted">Transaction ID submitted</span> : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-brand-muted">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(order.createdAt))}</td>
                  <td className="px-4 py-4"><Link href={`/admin/orders/${order.orderNumber}`} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-brand-soft px-3 font-bold text-brand-purple"><Eye className="size-4" />View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!orders.length ? <p className="py-12 text-center text-sm font-semibold text-brand-muted">No orders match your filters.</p> : null}
      </section>

      <section className="grid gap-4 lg:hidden">
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.orderNumber}`} className="rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-brand-purple">{order.orderNumber}</p>
                <p className="mt-1 text-sm font-bold">{order.customerName}</p>
                <p className="mt-1 text-sm text-brand-muted">{order.customerPhone}</p>
              </div>
              <p className="font-black">Tk {formatPrice(order.total)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge value={order.orderStatus} />
              <StatusBadge value={order.paymentMethod} />
              <StatusBadge value={order.paymentStatus} />
            </div>
            {order.paymentMethod !== "cod" && order.hasPaymentTransactionId ? <p className="mt-3 text-xs font-bold text-brand-muted">Transaction ID submitted</p> : null}
          </Link>
        ))}
        {!orders.length ? <p className="rounded-2xl bg-white py-12 text-center text-sm font-semibold text-brand-muted">No orders match your filters.</p> : null}
      </section>
    </div>
  );
}
