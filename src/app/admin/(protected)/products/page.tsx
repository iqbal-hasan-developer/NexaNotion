import Link from "next/link";
import Image from "next/image";
import { Edit, Plus, Search } from "lucide-react";
import { StatusActionButton } from "@/components/admin/status-action-button";
import { getAdminCategories, getAdminProducts } from "@/lib/admin/data";
import { formatPrice } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ q?: string; categoryId?: string; active?: string; stock?: string }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getAdminProducts(params), getAdminCategories()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Products</p>
          <h1 className="mt-2 text-3xl font-black">Product management</h1>
          <p className="mt-2 text-sm text-brand-muted">Create, edit, archive, and monitor stock for Supabase products.</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 text-sm font-black text-white">
          <Plus className="size-4" />New product
        </Link>
      </div>

      <form className="grid gap-3 rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm xl:grid-cols-[minmax(0,1fr)_220px_160px_160px_auto]">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-purple" />
          <input name="q" defaultValue={params.q ?? ""} placeholder="Search name or slug" className="min-h-11 w-full rounded-xl border border-brand-navy/10 bg-brand-soft pl-10 pr-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" />
        </label>
        <select name="categoryId" defaultValue={params.categoryId ?? ""} className="min-h-11 rounded-xl border border-brand-navy/10 bg-brand-soft px-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <select name="active" defaultValue={params.active ?? ""} className="min-h-11 rounded-xl border border-brand-navy/10 bg-brand-soft px-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select name="stock" defaultValue={params.stock ?? ""} className="min-h-11 rounded-xl border border-brand-navy/10 bg-brand-soft px-3 text-sm outline-none focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender">
          <option value="">All stock</option>
          <option value="low">Low stock</option>
        </select>
        <button className="min-h-11 rounded-xl bg-brand-navy px-5 text-sm font-black text-white transition hover:bg-brand-purple">Apply</button>
      </form>

      <section className="hidden overflow-hidden rounded-2xl border border-brand-navy/8 bg-white shadow-sm xl:block">
        <table className="w-full min-w-[1120px] text-left text-sm">
          <thead className="bg-brand-soft text-xs uppercase text-brand-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Badges</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-brand-navy/6">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 overflow-hidden rounded-xl bg-brand-soft">{product.imageUrl ? <Image src={product.imageUrl} alt="" fill sizes="56px" className="object-cover" /> : null}</div>
                    <div>
                      <p className="font-black">{product.name}</p>
                      <p className="text-xs text-brand-muted">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{product.categoryName ?? "Uncategorized"}</td>
                <td className="px-4 py-4"><p className="font-bold">Tk {formatPrice(product.price)}</p>{product.compareAtPrice ? <p className="text-xs text-brand-muted line-through">Tk {formatPrice(product.compareAtPrice)}</p> : null}</td>
                <td className="px-4 py-4"><span className={product.inventoryTracking && product.stock <= product.lowStockThreshold ? "font-black text-rose-700" : "font-bold"}>{product.stock}</span></td>
                <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${product.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-700 ring-slate-200"}`}>{product.isActive ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-4"><div className="flex flex-wrap gap-1">{product.isBestSeller ? <span className="rounded-full bg-brand-soft px-2 py-1 text-xs font-bold">Best</span> : null}{product.isNew ? <span className="rounded-full bg-brand-soft px-2 py-1 text-xs font-bold">New</span> : null}{product.isOffer ? <span className="rounded-full bg-brand-soft px-2 py-1 text-xs font-bold">Offer</span> : null}</div></td>
                <td className="px-4 py-4 text-brand-muted">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(product.updatedAt))}</td>
                <td className="px-4 py-4"><div className="flex gap-2"><Link href={`/admin/products/${product.slug}/edit`} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-brand-soft px-3 font-bold text-brand-purple"><Edit className="size-4" />Edit</Link><StatusActionButton endpoint={`/api/admin/products/${product.id}`} isActive={product.isActive} label={product.isActive ? "Archive" : "Republish"} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length ? <p className="py-12 text-center text-sm font-semibold text-brand-muted">No products match your filters.</p> : null}
      </section>

      <section className="grid gap-4 xl:hidden">
        {products.map((product) => (
          <article key={product.id} className="rounded-2xl border border-brand-navy/8 bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-brand-soft">{product.imageUrl ? <Image src={product.imageUrl} alt="" fill sizes="80px" className="object-cover" /> : null}</div>
              <div className="min-w-0 flex-1">
                <p className="font-black">{product.name}</p>
                <p className="mt-1 truncate text-xs text-brand-muted">{product.slug}</p>
                <p className="mt-2 text-sm font-bold">Tk {formatPrice(product.price)} / Stock {product.stock}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin/products/${product.slug}/edit`} className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-brand-soft px-3 text-sm font-bold text-brand-purple"><Edit className="size-4" />Edit</Link>
              <StatusActionButton endpoint={`/api/admin/products/${product.id}`} isActive={product.isActive} label={product.isActive ? "Archive" : "Republish"} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
