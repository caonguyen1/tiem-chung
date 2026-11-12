import { asc } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ArticleForm } from "@/components/admin/article-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm bài viết" };

export default async function NewArticlePage() {
  await requireAdmin();
  const [categories, doctors] = await Promise.all([
    db.select({ id: schema.articleCategories.id, name: schema.articleCategories.name, isPromotion: schema.articleCategories.isPromotion }).from(schema.articleCategories).orderBy(asc(schema.articleCategories.sortOrder)),
    db.select({ id: schema.doctors.id, title: schema.doctors.title, name: schema.doctors.name }).from(schema.doctors).orderBy(asc(schema.doctors.sortOrder)),
  ]);
  return (
    <>
      <AdminPageHeader title="Thêm bài viết" />
      <ArticleForm categories={categories} doctors={doctors} />
    </>
  );
}
