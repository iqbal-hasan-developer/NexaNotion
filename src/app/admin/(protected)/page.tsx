import Link from "next/link";
import { Boxes, Mail, PackageCheck, Shapes, ShoppingBag, Truck, WalletCards } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { getDashboardData } from "@/lib/admin/data";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const { stats, recentOrders, recentMessages } = await getDashboardData();
  const cards = [
    { label: "Total orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Pending orders", value: stats.pendingOrders, icon: PackageCheck },
    { label: "Confirmed / processing", value: stats.activeOrders, icon: Truck },
    { label: "Delivered orders", value: stats.deliveredOrders, icon: PackageCheck },
    { label: "Unpaid payments", value: stats.unpaidPayments, icon: WalletCards },
    { label: "Revenue", value: `Tk ${formatPrice(stats.totalRevenue)}`, icon: WalletCards },
    { label: "New messages", value: stats.newMessages, icon: Mail },
    { label: "Total products", value: stats.totalProducts, icon: Boxes },
    { label: "Active products", value: stats.activeProducts, icon: Boxes },
    { label: "Low stock products", value: stats.lowStockProducts, icon: Boxes },
    { label: "Categories", value: stats.totalCategories, icon: Shapes },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black">Admin overview</h1>
        <p className="mt-2 text-sm text-brand-muted">Monitor orders, payment status, and customer messages from one place.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-brand-muted">{label}</p>
              <span className="grid size-10 place-items-center rounded-xl bg-brand-lavender text-brand-purple"><Icon className="size-5" /></span>
            </div>
            <p className="mt-4 text-3xl font-black">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-brand-purple">View all</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-brand-muted">
                <tr className="border-b border-brand-navy/8">
                  <th className="py-3 pr-4">Order</th>
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Order</th>
                  <th className="py-3 pr-4">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-brand-navy/6 last:border-0">
                    <td className="py-3 pr-4 font-black"><Link href={`/admin/orders/${order.orderNumber}`} className="text-brand-purple">{order.orderNumber}</Link></td>
                    <td className="py-3 pr-4">{order.customerName}</td>
                    <td className="py-3 pr-4 font-bold">Tk {formatPrice(order.total)}</td>
                    <td className="py-3 pr-4"><StatusBadge value={order.orderStatus} /></td>
                    <td className="py-3 pr-4"><StatusBadge value={order.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!recentOrders.length ? <p className="py-8 text-center text-sm font-semibold text-brand-muted">No orders yet.</p> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm font-bold text-brand-purple">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentMessages.map((message) => (
              <Link key={message.id} href={`/admin/messages/${message.id}`} className="block rounded-xl border border-brand-navy/8 p-4 transition hover:border-brand-purple/25 hover:bg-brand-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black">{message.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-brand-muted">{message.subject || message.message}</p>
                  </div>
                  <StatusBadge value={message.status} />
                </div>
              </Link>
            ))}
            {!recentMessages.length ? <p className="py-8 text-center text-sm font-semibold text-brand-muted">No messages yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
