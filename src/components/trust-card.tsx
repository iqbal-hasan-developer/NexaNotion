import type { LucideIcon } from "lucide-react";

export function TrustCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="motion-card group flex gap-4 border-b border-brand-navy/8 py-6 last:border-b-0 hover:bg-brand-soft/60 sm:border-b-0 sm:p-5">
      <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-lavender text-brand-purple transition-transform duration-300 group-hover:scale-[1.03]"><Icon className="size-5" /></div>
      <div><h3 className="font-semibold text-brand-navy">{title}</h3><p className="mt-1 text-sm leading-6 text-brand-muted">{description}</p></div>
    </div>
  );
}
