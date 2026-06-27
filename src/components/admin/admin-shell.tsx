"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Mail, Shapes, ShoppingBag, Store } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Shapes },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-brand-navy/8 bg-white px-5 py-6 lg:block">
        <AdminBrand />
        <AdminNav pathname={pathname} />
        <div className="absolute bottom-6 left-5 right-5 space-y-3">
          <Link href="/" className="motion-press flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-navy/10 text-sm font-bold text-brand-navy transition hover:border-brand-purple/30 hover:bg-brand-lavender/40">
            <Store className="size-4" />
            View Store
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-brand-navy/8 bg-white/92 px-4 py-3 shadow-sm backdrop-blur md:px-6 lg:px-8">
          <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <AdminBrand compact />
              <span className="min-w-0 max-w-[45vw] truncate rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-muted md:max-w-sm">{email}</span>
            </div>
            <nav className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Admin navigation">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
                return (
                  <Link key={href} href={href} className={`motion-press inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-bold transition ${active ? "bg-brand-gradient text-white" : "bg-brand-soft text-brand-navy/72 hover:bg-brand-lavender/50 hover:text-brand-purple"}`}>
                    <Icon className="size-4" />
                    {label}
                  </Link>
                );
              })}
              <Link href="/" className="motion-press inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-brand-soft px-3 text-sm font-bold text-brand-navy/72 hover:bg-brand-lavender/50 hover:text-brand-purple">
                <Store className="size-4" />
                Store
              </Link>
            </nav>
            <div className="hidden md:block lg:hidden">
              <LogoutButton compact />
            </div>
          </div>
        </header>
        <main className="soft-enter px-4 py-6 md:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function AdminBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/admin" className="motion-lift flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-2xl bg-brand-gradient text-lg font-black text-white">N</span>
      <span>
        <span className={`block font-black ${compact ? "text-base" : "text-xl"}`}>NexaNotion</span>
        <span className="block text-xs font-semibold text-brand-muted">Admin console</span>
      </span>
    </Link>
  );
}

function AdminNav({ pathname }: { pathname: string }) {
  return (
    <nav className="mt-8 space-y-2" aria-label="Admin navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`motion-press flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold transition ${active ? "bg-brand-gradient text-white shadow-[0_12px_30px_rgba(91,33,232,0.2)]" : "text-brand-navy/70 hover:bg-brand-soft hover:text-brand-purple"}`}>
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
