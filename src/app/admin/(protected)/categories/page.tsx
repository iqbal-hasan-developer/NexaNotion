import Link from "next/link";
import Image from "next/image";
import { Edit, Plus, Search } from "lucide-react";
import { StatusActionButton } from "@/components/admin/status-action-button";
import { getAdminCategories } from "@/lib/admin/data";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const categories = await getAdminCategories({ search: params.q });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Categories</p>
          <h1 className="mt-2 text-3xl font-black">Category management</h1>
          <p className="mt-2 text-sm text-brand-muted">Create, edit, archive, and sort public product categories.</p>
        </div>
        <Link href="/admin/categories/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-black text-white">
          <Plus className="size-4" />New category
        </Link>
      </div>

      <form className="grid gap-3 rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="relative block">
          <span className="sr-only">Search categories</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-purple" />
          <input name="q" defaultValue={params.q ?? ""} placeholder="Search name or slug" className="min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft pl-10 pr-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
        </label>
        <button className="min-h-11 rounded-xl bg-brand-navy px-5 text-sm font-black text-white transition hover:bg-brand-purple">Apply</button>
      </form>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-brand-soft">{category.imageUrl ? <Image src={category.imageUrl} alt="" fill sizes="80px" className="object-cover" /> : null}</div>
              <div className="min-w-0 flex-1">
                <p className="font-black">{category.name}</p>
                <p className="mt-1 truncate text-xs text-brand-muted">{category.slug}</p>
                <p className="mt-2 text-sm font-bold">{category.isActive ? "Active" : "Inactive"} / Sort {category.sortOrder}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-brand-muted">{category.description || "No description yet."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin/categories/${category.slug}/edit`} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-brand-soft px-3 text-sm font-bold text-brand-purple"><Edit className="size-4" />Edit</Link>
              <StatusActionButton endpoint={`/api/admin/categories/${category.id}`} isActive={category.isActive} label={category.isActive ? "Archive" : "Republish"} />
            </div>
          </article>
        ))}
        {!categories.length ? <p className="rounded-2xl bg-white py-12 text-center text-sm font-semibold text-brand-muted lg:col-span-2 xl:col-span-3">No categories match your filters.</p> : null}
      </section>
    </div>
  );
}
