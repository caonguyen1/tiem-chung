import { asc, count, eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { EmptyList, ListTable, ListToolbar, RowActions, VisibleBadge } from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import { deleteCategory, moveCategory, toggleCategory } from "@/lib/actions/admin/articles";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Chuyên mục bài viết" };

export default async function CategoriesAdminPage() {
  await requireAdmin();
  const rows = await db
    .select({ category: schema.articleCategories, articles: count(schema.articles.id) })
    .from(schema.articleCategories)
    .leftJoin(schema.articles, eq(schema.articles.categoryId, schema.articleCategories.id))
    .groupBy(schema.articleCategories.id)
    .orderBy(asc(schema.articleCategories.sortOrder));

  return (
    <>
      <AdminPageHeader title="Chuyên mục bài viết" description="Chuyên mục của bài Kiến thức và chuyên mục Khuyến mãi. Chuyên mục còn bài viết thì chưa xóa được." />
      <ListToolbar query="" placeholder="" addHref="/admin/bai-viet/chuyen-muc/moi" addLabel="Thêm chuyên mục" hideSearch />
      <ListTable columns={[{ label: "Chuyên mục" }, { label: "Trạng thái", className: "w-32" }, { label: "", className: "w-48" }]} empty={rows.length === 0 && <EmptyList text="Chưa có chuyên mục." />}>
        {rows.map(({ category, articles }) => (
          <li key={category.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 tab:px-5">
            <div className="min-w-0 flex-1 basis-56">
              <p className="flex flex-wrap items-center gap-2 font-bold text-brand-800">
                {category.name}
                {category.isPromotion && <StatusBadge tone="new">Khuyến mãi</StatusBadge>}
              </p>
              <p className="truncate text-[13px] text-subtle">
                /{category.slug} · {articles} bài viết
              </p>
            </div>
            <div className="w-32">
              <VisibleBadge visible={category.isVisible} />
            </div>
            <div className="w-48">
              <RowActions
                id={category.id}
                editHref={`/admin/bai-viet/chuyen-muc/${category.id}`}
                visible={category.isVisible}
                onToggle={toggleCategory}
                onMove={moveCategory}
                onDelete={deleteCategory}
                deleteMessage={`Xóa chuyên mục "${category.name}"?`}
                deleteBlocked={articles > 0 ? "Chuyên mục còn bài viết" : undefined}
              />
            </div>
          </li>
        ))}
      </ListTable>
    </>
  );
}
