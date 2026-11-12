import { asc, count, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ListToolbar, PAGE_SIZE, Pagination, SimpleList, listParams } from "@/components/admin/admin-list";
import { db, schema } from "@/db";
import { deletePackage, movePackage, togglePackage } from "@/lib/actions/admin/packages";
import { requireAdmin } from "@/lib/auth/session";
import { formatVnd } from "@/lib/format";

export const metadata: Metadata = { title: "Gói vắc xin" };

export default async function PackagesAdminPage({ searchParams }: PageProps<"/admin/goi-vac-xin">) {
  await requireAdmin();
  const { q, page, offset } = listParams(await searchParams);
  const where = q ? or(ilike(schema.vaccinePackages.name, `%${q}%`), ilike(schema.vaccinePackages.slug, `%${q}%`)) : undefined;
  const [rows, [total]] = await Promise.all([
    db.select().from(schema.vaccinePackages).where(where).orderBy(asc(schema.vaccinePackages.sortOrder)).limit(PAGE_SIZE).offset(offset),
    db.select({ n: count() }).from(schema.vaccinePackages).where(where),
  ]);

  return (
    <>
      <AdminPageHeader title="Gói vắc xin" description="Gói theo độ tuổi và theo đối tượng. Dùng mũi tên để đổi thứ tự." />
      <ListToolbar query={q} placeholder="Tìm theo tên hoặc đường dẫn" addHref="/admin/goi-vac-xin/moi" addLabel="Thêm gói" />
      <SimpleList
        title="Gói vắc xin"
        rows={rows.map((row) => ({
          id: row.id,
          title: row.name,
          meta: `${row.kind === "age" ? "Theo độ tuổi" : "Theo đối tượng"} · ${row.vaccineCount} loại, ${row.doseCount} mũi · ${formatVnd(row.price)}${row.highlight ? ` · ${row.highlight}` : ""}`,
          visible: row.isVisible,
        }))}
        basePath="/admin/goi-vac-xin"
        onToggle={togglePackage}
        onMove={movePackage}
        onDelete={deletePackage}
        deleteMessage={(row) => `Xóa gói "${row.title}"? Không thể hoàn tác.`}
        empty={q ? "Không tìm thấy gói nào." : "Chưa có gói vắc xin."}
      />
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={(number) => `/admin/goi-vac-xin?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`} />
    </>
  );
}
