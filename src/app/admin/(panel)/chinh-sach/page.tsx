import { count, ilike, or, asc } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { EmptyList, ListTable, ListToolbar, PAGE_SIZE, Pagination, listParams, RowActions, VisibleBadge } from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import { deletePolicy, movePolicy, togglePolicy } from "@/lib/actions/admin/policies";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Trang chính sách" };

export default async function PoliciesAdminPage({ searchParams }: PageProps<"/admin/chinh-sach">) {
  await requireAdmin();
  const { q, page, offset } = listParams(await searchParams);
  const where = q ? or(ilike(schema.policyPages.title, `%${q}%`), ilike(schema.policyPages.slug, `%${q}%`)) : undefined;
  const [rows, [total]] = await Promise.all([
    db.select().from(schema.policyPages).where(where).orderBy(asc(schema.policyPages.sortOrder)).limit(PAGE_SIZE).offset(offset),
    db.select({ n: count() }).from(schema.policyPages).where(where),
  ]);

  return (
    <>
      <AdminPageHeader title="Trang chính sách" description="Nội dung các trang chính sách hiển thị ở chân trang và menu. Dùng mũi tên để đổi thứ tự." />
      <ListToolbar query={q} placeholder="Tìm theo tiêu đề hoặc đường dẫn" addHref="/admin/chinh-sach/moi" addLabel="Thêm trang" />
      <ListTable columns={[{ label: "Tiêu đề" }, { label: "Trạng thái", className: "w-32" }, { label: "", className: "w-48" }]} empty={rows.length === 0 && <EmptyList text={q ? "Không tìm thấy trang nào." : "Chưa có trang chính sách."} />}>
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 tab:px-5">
            <div className="min-w-0 flex-1 basis-56">
              <p className="font-bold text-brand-800">{row.title}</p>
              <p className="truncate text-[13px] text-subtle">/chinh-sach/{row.slug}</p>
            </div>
            <div className="w-32">
              <VisibleBadge visible={row.isVisible} />
            </div>
            <div className="w-48">
              <RowActions id={row.id} editHref={`/admin/chinh-sach/${row.id}`} visible={row.isVisible} onToggle={togglePolicy} onMove={movePolicy} onDelete={deletePolicy} deleteMessage={`Xóa trang "${row.title}"? Không thể hoàn tác.`} />
            </div>
          </li>
        ))}
      </ListTable>
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={(number) => `/admin/chinh-sach?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`} />
    </>
  );
}
