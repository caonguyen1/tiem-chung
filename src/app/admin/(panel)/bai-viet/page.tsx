import { count, desc, eq, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader, formatDateTime, StatusBadge } from "@/components/admin/admin-ui";
import { EmptyList, ListTable, ListToolbar, PAGE_SIZE, Pagination, listParams, RowActions, VisibleBadge } from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import { deleteArticle, toggleArticle } from "@/lib/actions/admin/articles";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Bài viết" };

export default async function ArticlesAdminPage({ searchParams }: PageProps<"/admin/bai-viet">) {
  await requireAdmin();
  const { q, page, offset } = listParams(await searchParams);
  const where = q ? or(ilike(schema.articles.title, `%${q}%`), ilike(schema.articles.slug, `%${q}%`)) : undefined;
  const [rows, [total]] = await Promise.all([
    db
      .select({ article: schema.articles, category: schema.articleCategories.name })
      .from(schema.articles)
      .leftJoin(schema.articleCategories, eq(schema.articleCategories.id, schema.articles.categoryId))
      .where(where)
      .orderBy(desc(schema.articles.publishedAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ n: count() }).from(schema.articles).where(where),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Bài viết"
        description="Bài kiến thức, bài khuyến mãi và cảnh báo dịch bệnh. Bài mới nhất nằm trên cùng."
        actions={
          <Link href="/admin/bai-viet/chuyen-muc" className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-bold text-brand-600 ring-1 ring-brand-200 ring-inset hover:bg-brand-50">
            Quản lý chuyên mục
          </Link>
        }
      />
      <ListToolbar query={q} placeholder="Tìm theo tiêu đề hoặc đường dẫn" addHref="/admin/bai-viet/moi" addLabel="Thêm bài viết" />
      <ListTable columns={[{ label: "Bài viết" }, { label: "Trạng thái", className: "w-32" }, { label: "", className: "w-32" }]} empty={rows.length === 0 && <EmptyList text={q ? "Không tìm thấy bài viết nào." : "Chưa có bài viết."} />}>
        {rows.map(({ article, category }) => (
          <li key={article.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 tab:px-5">
            <div className="min-w-0 flex-1 basis-60">
              <p className="font-bold text-brand-800">{article.title}</p>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-subtle">
                {category ?? "Chưa có chuyên mục"} · {formatDateTime(article.publishedAt ?? article.createdAt)}
                {article.isFeatured && <StatusBadge tone="new">Nổi bật</StatusBadge>}
                {article.isOutbreakAlert && <StatusBadge tone="warn">Cảnh báo dịch</StatusBadge>}
              </p>
            </div>
            <div className="w-32">
              <VisibleBadge visible={article.isVisible} />
            </div>
            <div className="w-32">
              <RowActions id={article.id} editHref={`/admin/bai-viet/${article.id}`} visible={article.isVisible} onToggle={toggleArticle} onDelete={deleteArticle} deleteMessage={`Xóa bài "${article.title}"? Không thể hoàn tác.`} />
            </div>
          </li>
        ))}
      </ListTable>
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={(number) => `/admin/bai-viet?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`} />
    </>
  );
}
