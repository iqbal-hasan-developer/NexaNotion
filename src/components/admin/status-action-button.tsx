"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, RotateCcw } from "lucide-react";

export function StatusActionButton({
  endpoint,
  isActive,
  label,
}: {
  endpoint: string;
  isActive: boolean;
  label: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const Icon = isActive ? Archive : RotateCcw;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="motion-press inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-brand-navy/10 px-3 text-sm font-bold text-brand-muted transition hover:border-brand-purple/25 hover:bg-brand-lavender/40 hover:text-brand-purple disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon className="size-4" />
      {loading ? "Saving..." : label}
    </button>
  );
}
