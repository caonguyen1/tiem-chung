import { asc, count, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import {
  EmptyList,
  ListTable,
  ListToolbar,
  PAGE_SIZE,
  Pagination,
  listParams,
  RowActions,
  VisibleBadge,
} from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import {
  deleteCenter,
  moveCenter,
  toggleCenter,
} from "@/lib/actions/admin/centers";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Trung tâm tiêm chủng" };

export default async function CenterAdminPage({
  searchParams,
}: PageProps<"/admin/trung-tam">) {
  await requireAdmin();
  const { q, page, offset } = listParams(await searchParams);
  const where = q
    ? or(
        ilike(schema.centers.name, `%${q}%`),
        ilike(schema.centers.address, `%${q}%`),
      )
    : undefined;
  const [rows, [total]] = await Promise.all([
    db
      .select()
      .from(schema.centers)
      .where(where)
      .orderBy(asc(schema.centers.sortOrder))
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ n: count() }).from(schema.centers).where(where),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Trung tâm tiêm chủng"
        description="Các trung tâm hiển thị ở trang Hệ thống trung tâm. Dùng mũi tên để đổi thứ tự."
      />
      <ListToolbar
        query={q}
        placeholder="Tìm theo tên hoặc địa chỉ"
        addHref="/admin/trung-tam/moi"
        addLabel="Thêm"
      />
      <ListTable
        columns={[
          { label: "Trung tâm tiêm chủng" },
          { label: "Trạng thái", className: "w-32" },
          { label: "", className: "w-48" },
        ]}
        empty={
          rows.length === 0 && (
            <EmptyList
              text={q ? "Không tìm thấy kết quả." : "Chưa có trung tâm."}
            />
          )
        }
      >
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 tab:px-5"
          >
            <div className="min-w-0 flex-1 basis-56">
              <p className="font-bold text-brand-800">{row.name}</p>
              <p className="truncate text-[13px] text-subtle">{row.address}</p>
            </div>
            <div className="w-32">
              <VisibleBadge visible={row.isVisible} />
            </div>
            <div className="w-48">
              <RowActions
                id={row.id}
                editHref={`/admin/trung-tam/${row.id}`}
                visible={row.isVisible}
                onToggle={toggleCenter}
                onMove={moveCenter}
                onDelete={deleteCenter}
                deleteMessage={`Xóa "${row.name}"? Không thể hoàn tác.`}
              />
            </div>
          </li>
        ))}
      </ListTable>
      <Pagination
        page={page}
        pages={Math.ceil(total.n / PAGE_SIZE)}
        hrefFor={(number) =>
          `/admin/trung-tam?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`
        }
      />
    </>
  );
}
