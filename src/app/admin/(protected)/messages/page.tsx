import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { StatusBadge, formatAdminLabel } from "@/components/admin/status-badge";
import { getAdminMessages } from "@/lib/admin/data";
import { messageStatuses } from "@/lib/admin/statuses";

type Props = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function AdminMessagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const messages = await getAdminMessages({ status: params.status, search: params.q });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Messages</p>
          <h1 className="mt-2 text-3xl font-black">Contact messages</h1>
          <p className="mt-2 text-sm text-brand-muted">Review customer questions and update reply status.</p>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">{messages.length} messages</p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <label className="relative block">
          <span className="sr-only">Search messages</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-purple" />
          <input name="q" defaultValue={params.q ?? ""} placeholder="Search name, phone, email, subject" className="min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft pl-10 pr-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
        </label>
        <label>
          <span className="sr-only">Message status</span>
          <select name="status" defaultValue={params.status ?? ""} className="min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
            <option value="">All statuses</option>
            {messageStatuses.map((status) => <option key={status} value={status}>{formatAdminLabel(status)}</option>)}
          </select>
        </label>
        <button className="min-h-11 rounded-xl bg-brand-navy px-5 text-sm font-black text-white transition hover:bg-brand-purple">Apply</button>
      </form>

      <section className="hidden overflow-hidden rounded-2xl border border-brand-navy/8 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-brand-soft text-xs uppercase text-brand-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="border-t border-brand-navy/6">
                  <td className="px-4 py-4 font-black">{message.name}</td>
                  <td className="px-4 py-4">{message.phone ?? "—"}</td>
                  <td className="px-4 py-4">{message.email ?? "—"}</td>
                  <td className="px-4 py-4">{message.subject ?? "—"}</td>
                  <td className="max-w-xs px-4 py-4 text-brand-muted"><span className="line-clamp-2">{message.message}</span></td>
                  <td className="px-4 py-4"><StatusBadge value={message.status} /></td>
                  <td className="px-4 py-4 text-brand-muted">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(message.createdAt))}</td>
                  <td className="px-4 py-4"><Link href={`/admin/messages/${message.id}`} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-brand-soft px-3 font-bold text-brand-purple"><Eye className="size-4" />View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!messages.length ? <p className="py-12 text-center text-sm font-semibold text-brand-muted">No messages match your filters.</p> : null}
      </section>

      <section className="grid gap-4 lg:hidden">
        {messages.map((message) => (
          <Link key={message.id} href={`/admin/messages/${message.id}`} className="rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-black">{message.name}</p>
                <p className="mt-1 text-sm text-brand-muted">{message.phone ?? message.email ?? "No contact detail"}</p>
                <p className="mt-3 line-clamp-2 text-sm text-brand-muted">{message.subject || message.message}</p>
              </div>
              <StatusBadge value={message.status} />
            </div>
          </Link>
        ))}
        {!messages.length ? <p className="rounded-2xl bg-white py-12 text-center text-sm font-semibold text-brand-muted">No messages match your filters.</p> : null}
      </section>
    </div>
  );
}
