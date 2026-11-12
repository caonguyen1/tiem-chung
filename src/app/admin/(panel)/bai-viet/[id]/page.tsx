import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ArticleForm } from "@/components/admin/article-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa bài viết" };

export default async function EditArticlePage({ params }: PageProps<"/admin/bai-viet/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[article], categories, doctors] = await Promise.all([
    db.select().from(schema.articles).where(eq(schema.articles.id, id)),
    db.select({ id: schema.articleCategories.id, name: schema.articleCategories.name, isPromotion: schema.articleCategories.isPromotion }).from(schema.articleCategories).orderBy(asc(schema.articleCategories.sortOrder)),
    db.select({ id: schema.doctors.id, title: schema.doctors.title, name: schema.doctors.name }).from(schema.doctors).orderBy(asc(schema.doctors.sortOrder)),
  ]);
  if (!article) notFound();
  return (
    <>
      <AdminPageHeader title={article.title} description={`Địa chỉ bài: /kien-thuc/bai-viet/${article.slug}`} />
      <ArticleForm article={article} categories={categories} doctors={doctors} />
    </>
  );
}
