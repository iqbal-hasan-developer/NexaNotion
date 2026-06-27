import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { MessageStatusForm } from "@/components/admin/message-status-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminMessage } from "@/lib/admin/data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminMessageDetailPage({ params }: Props) {
  const { id } = await params;
  const message = await getAdminMessage(id);
  if (!message) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/messages" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted transition hover:text-brand-purple">
        <ArrowLeft className="size-4" />
        Back to messages
      </Link>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Message detail</p>
                <h1 className="mt-2 text-3xl font-black">{message.subject || "Customer message"}</h1>
                <p className="mt-2 text-sm text-brand-muted">Received {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.createdAt))}</p>
              </div>
              <StatusBadge value={message.status} />
            </div>
          </section>

          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Customer</h2>
            <p className="mt-4 font-black">{message.name}</p>
            <div className="mt-3 grid gap-2 text-sm text-brand-muted sm:grid-cols-2">
              <p className="flex items-center gap-2"><Phone className="size-4" />{message.phone ?? "No phone"}</p>
              <p className="flex items-center gap-2"><Mail className="size-4" />{message.email ?? "No email"}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Message</h2>
            <p className="mt-4 whitespace-pre-wrap rounded-xl bg-brand-soft p-4 text-sm leading-7 text-brand-navy">{message.message}</p>
          </section>
        </div>

        <aside>
          <MessageStatusForm id={message.id} initialStatus={message.status} />
        </aside>
      </div>
    </div>
  );
}
