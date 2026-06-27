"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { formatAdminLabel } from "@/components/admin/status-badge";
import { messageStatuses } from "@/lib/admin/statuses";
import type { MessageStatus } from "@/types";

export function MessageStatusForm({ id, initialStatus }: { id: string; initialStatus: MessageStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState<MessageStatus>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await response.json()) as { ok?: true; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not update this message. Please try again.");
        return;
      }

      setMessage("Message updated.");
      router.refresh();
    } catch {
      setError("Could not update this message. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-brand-navy/8 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black">Update message</h2>
      <label className="mt-4 block text-sm font-bold">
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value as MessageStatus)} className="mt-2 min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft px-3 font-normal outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
          {messageStatuses.map((item) => <option key={item} value={item}>{formatAdminLabel(item)}</option>)}
        </select>
      </label>
      {message ? <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
      <button type="submit" disabled={saving} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
        <Save className="size-4" />
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
