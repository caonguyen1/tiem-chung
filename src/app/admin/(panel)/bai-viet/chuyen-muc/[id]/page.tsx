import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { CategoryForm } from "@/components/admin/category-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa chuyên mục" };

export default async function EditCategoryPage({ params }: PageProps<"/admin/bai-viet/chuyen-muc/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [category] = await db.select().from(schema.articleCategories).where(eq(schema.articleCategories.id, id));
  if (!category) notFound();
  return (
    <>
      <AdminPageHeader title={category.name} />
      <CategoryForm category={category} />
    </>
  );
}
