"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={`motion-press inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white transition hover:bg-brand-purple disabled:cursor-not-allowed disabled:opacity-70 ${compact ? "" : "w-full"}`}
    >
      <LogOut className="size-4" />
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
