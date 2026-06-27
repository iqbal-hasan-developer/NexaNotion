import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories, getAdminProduct } from "@/lib/admin/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(slug), getAdminCategories()]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted transition hover:text-brand-purple"><ArrowLeft className="size-4" />Back to products</Link>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Products</p>
        <h1 className="mt-2 text-3xl font-black">Edit product</h1>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
