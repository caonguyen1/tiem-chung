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
  deleteDoctor,
  moveDoctor,
  toggleDoctor,
} from "@/lib/actions/admin/doctors";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Đội ngũ chuyên môn" };

export default async function DoctorAdminPage({
  searchParams,
}: PageProps<"/admin/doi-ngu">) {
  await requireAdmin();
  const { q, page, offset } = listParams(await searchParams);
  const where = q
    ? or(
        ilike(schema.doctors.name, `%${q}%`),
        ilike(schema.doctors.specialty, `%${q}%`),
      )
    : undefined;
  const [rows, [total]] = await Promise.all([
    db
      .select()
      .from(schema.doctors)
      .where(where)
      .orderBy(asc(schema.doctors.sortOrder))
      .limit(PAGE_SIZE)
      .offset(offset),
    db.select({ n: count() }).from(schema.doctors).where(where),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Đội ngũ chuyên môn"
        description="Bác sĩ hiển thị ở trang Đội ngũ chuyên môn và làm người kiểm duyệt nội dung. Dùng mũi tên để đổi thứ tự."
      />
      <ListToolbar
        query={q}
        placeholder="Tìm theo tên hoặc chuyên khoa"
        addHref="/admin/doi-ngu/moi"
        addLabel="Thêm"
      />
      <ListTable
        columns={[
          { label: "Đội ngũ chuyên môn" },
          { label: "Trạng thái", className: "w-32" },
          { label: "", className: "w-48" },
        ]}
        empty={
          rows.length === 0 && (
            <EmptyList
              text={q ? "Không tìm thấy kết quả." : "Chưa có bác sĩ."}
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
              <p className="text-[13px] font-bold text-link">{row.title}</p>
              <p className="font-bold text-brand-800">{row.name}</p>
              <p className="truncate text-[13px] text-subtle">
                {row.specialty}
              </p>
            </div>
            <div className="w-32">
              <VisibleBadge visible={row.isVisible} />
            </div>
            <div className="w-48">
              <RowActions
                id={row.id}
                editHref={`/admin/doi-ngu/${row.id}`}
                visible={row.isVisible}
                onToggle={toggleDoctor}
                onMove={moveDoctor}
                onDelete={deleteDoctor}
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
          `/admin/doi-ngu?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`
        }
      />
    </>
  );
}
