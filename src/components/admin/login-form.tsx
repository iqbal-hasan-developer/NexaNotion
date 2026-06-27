"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { ok: true } | { error?: string };

      if (!response.ok) {
        setError("error" in data && data.error ? data.error : "Could not sign in. Please try again.");
        return;
      }

      const next = searchParams.get("next");
      router.replace(next?.startsWith("/admin") && next !== "/admin/login" ? next : "/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login} className="space-y-4">
      <label className="block text-sm font-bold text-brand-navy">
        Admin email
        <span className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-brand-navy/10 bg-white px-4 shadow-inner focus-within:border-brand-purple/50 focus-within:ring-4 focus-within:ring-brand-lavender">
          <Mail className="size-4 text-brand-purple" />
          <input name="email" type="email" required autoComplete="email" className="min-w-0 flex-1 bg-transparent font-normal outline-none" placeholder="admin@example.com" />
        </span>
      </label>
      <label className="block text-sm font-bold text-brand-navy">
        Password
        <span className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-brand-navy/10 bg-white px-4 shadow-inner focus-within:border-brand-purple/50 focus-within:ring-4 focus-within:ring-brand-lavender">
          <LockKeyhole className="size-4 text-brand-purple" />
          <input name="password" type="password" required autoComplete="current-password" className="min-w-0 flex-1 bg-transparent font-normal outline-none" placeholder="Password" />
        </span>
      </label>
      {error ? <p className="rounded-xl bg-brand-lavender/70 p-3 text-sm font-semibold leading-5 text-brand-navy">{error}</p> : null}
      <button type="submit" disabled={loading} className="min-h-12 w-full rounded-xl bg-brand-gradient px-5 text-sm font-black text-white shadow-[0_14px_34px_rgba(91,33,232,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
