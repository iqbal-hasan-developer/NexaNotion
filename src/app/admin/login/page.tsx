import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/login-form";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Admin Login",
  description: "Sign in to the NexaNotion admin console.",
  path: "/admin/login",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-soft px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-brand-navy/8 bg-white p-6 shadow-[0_24px_70px_rgba(5,10,31,0.08)] sm:p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted transition hover:text-brand-purple">
          <ArrowLeft className="size-4" />
          View store
        </Link>
        <div className="mt-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">NexaNotion Admin</p>
          <h1 className="mt-3 text-3xl font-black text-brand-navy">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-brand-muted">Use your Supabase Auth email and password. Access is restricted to allowlisted admin accounts.</p>
        </div>
        <div className="mt-7">
          <Suspense fallback={<div className="h-56 animate-pulse rounded-xl bg-brand-soft" />}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
