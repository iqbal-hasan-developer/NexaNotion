import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={category.href} className="motion-card motion-image-group group block min-w-[220px] overflow-hidden rounded-[1.4rem] border border-brand-navy/7 bg-white shadow-[0_14px_40px_rgba(5,10,31,0.06)] hover:border-brand-purple/20 hover:shadow-[0_18px_48px_rgba(5,10,31,0.1)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
        <Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 220px, 300px" className="motion-image object-cover" />
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div><h3 className="font-semibold text-brand-navy">{category.name}</h3><p className="mt-1 text-sm leading-5 text-brand-muted">{category.description}</p></div>
        <ArrowUpRight className="mt-0.5 size-5 shrink-0 text-brand-purple transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
