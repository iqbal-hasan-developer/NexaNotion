import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";
import { getAdminCategory } from "@/lib/admin/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getAdminCategory(slug);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/categories" className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted transition hover:text-brand-purple"><ArrowLeft className="size-4" />Back to categories</Link>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-purple">Categories</p>
        <h1 className="mt-2 text-3xl font-black">Edit category</h1>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
