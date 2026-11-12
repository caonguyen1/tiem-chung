import { asc, count, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ListToolbar, PAGE_SIZE, Pagination, SimpleList, listParams } from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import { deleteVaccine, moveVaccine, toggleVaccine } from "@/lib/actions/admin/vaccines";
import { requireAdmin } from "@/lib/auth/session";
import { formatVnd } from "@/lib/format";

export const metadata: Metadata = { title: "Vắc xin" };

const statusLabel = { book: "Đặt hẹn", preorder: "Đặt trước", consult: "Cần tư vấn" } as const;

export default async function VaccinesAdminPage({ searchParams }: PageProps<"/admin/vac-xin">) {
  await requireAdmin();
  const { q, page, offset } = listParams(await searchParams);
  const where = q ? or(ilike(schema.vaccines.name, `%${q}%`), ilike(schema.vaccines.slug, `%${q}%`), ilike(schema.vaccines.manufacturer, `%${q}%`)) : undefined;
  const [rows, [total], inPackages] = await Promise.all([
    db.select().from(schema.vaccines).where(where).orderBy(asc(schema.vaccines.sortOrder)).limit(PAGE_SIZE).offset(offset),
    db.select({ n: count() }).from(schema.vaccines).where(where),
    db.select({ vaccineId: schema.packageItems.vaccineId, n: count() }).from(schema.packageItems).groupBy(schema.packageItems.vaccineId),
  ]);
  const used = new Map(inPackages.map((row) => [row.vaccineId, row.n]));

  return (
    <>
      <AdminPageHeader title="Vắc xin" description="Danh mục vắc xin lẻ. Dùng mũi tên để đổi thứ tự (thứ tự cũng là thứ tự “được quan tâm”). Vắc xin đang nằm trong gói thì chưa xóa được." />
      <ListToolbar query={q} placeholder="Tìm theo tên, đường dẫn hoặc nhà sản xuất" addHref="/admin/vac-xin/moi" addLabel="Thêm vắc xin" />
      <SimpleList
        title="Vắc xin"
        rows={rows.map((row) => ({
          id: row.id,
          title: row.name,
          meta: `${formatVnd(row.price)} · ${statusLabel[row.status]} · ${row.origin}`,
          visible: row.isVisible,
          blocked: used.get(row.id) ? `Đang nằm trong ${used.get(row.id)} gói` : undefined,
        }))}
        basePath="/admin/vac-xin"
        onToggle={toggleVaccine}
        onMove={moveVaccine}
        onDelete={deleteVaccine}
        deleteMessage={(row) => `Xóa vắc xin "${row.title}"? Không thể hoàn tác.`}
        empty={q ? "Không tìm thấy vắc xin nào." : "Chưa có vắc xin."}
      />
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={(number) => `/admin/vac-xin?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`} />
    </>
  );
}
