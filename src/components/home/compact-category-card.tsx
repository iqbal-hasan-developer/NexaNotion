import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

export function CompactCategoryCard({ category, priority = false }: { category: Category; priority?: boolean }) {
  return (
    <Link
      href={category.href}
      aria-label={`Shop ${category.name}`}
      className="motion-lift group flex w-20 shrink-0 snap-start flex-col items-center gap-1.5 rounded-[1rem] px-1.5 py-2 text-center transition duration-300 focus-visible:-translate-y-1 sm:w-24 sm:px-2"
    >
      <span className="relative grid size-[60px] place-items-center rounded-full border border-brand-navy/8 bg-white shadow-[0_8px_22px_rgba(5,10,31,0.06)] transition duration-300 group-hover:border-brand-purple/35 group-hover:shadow-[0_14px_30px_rgba(91,33,232,0.14)] sm:size-20">
        <span className="absolute inset-1 rounded-full bg-gradient-to-br from-brand-soft via-white to-brand-lavender/70" />
        <span className="relative size-[52px] overflow-hidden rounded-full bg-brand-soft sm:size-[68px]">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 52px, 68px"
            className="motion-image object-cover object-center group-hover:scale-[1.03]"
          />
        </span>
      </span>
      <span className="text-xs font-semibold leading-4 text-brand-navy transition group-hover:text-brand-purple sm:text-sm sm:leading-5">{category.name}</span>
    </Link>
  );
}
