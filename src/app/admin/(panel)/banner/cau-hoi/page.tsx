import { asc, count, ilike, or } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ListToolbar, PAGE_SIZE, Pagination, SimpleList, listParams } from "@/components/admin/admin-list";
import { bannerTabs, ModuleTabs } from "@/components/admin/module-tabs";
import { db, schema } from "@/db";
import { deleteFaq, moveFaq, toggleFaq } from "@/lib/actions/admin/banners";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Câu hỏi thường gặp" };

export default async function FaqAdminPage({ searchParams }: PageProps<"/admin/banner/cau-hoi">) {
  await requireAdmin();
  const { q, page, offset } = listParams(await searchParams);
  const where = q ? or(ilike(schema.faqs.question, `%${q}%`), ilike(schema.faqs.answer, `%${q}%`)) : undefined;
  const [rows, [total]] = await Promise.all([
    db.select().from(schema.faqs).where(where).orderBy(asc(schema.faqs.sortOrder)).limit(PAGE_SIZE).offset(offset),
    db.select({ n: count() }).from(schema.faqs).where(where),
  ]);

  return (
    <>
      <AdminPageHeader title="Câu hỏi thường gặp" description="Hiện ở trang Câu hỏi thường gặp; các câu bật “Hiện ở trang chủ” có thể hiện ở trang chủ. Dùng mũi tên để đổi thứ tự." />
      <ModuleTabs tabs={bannerTabs} current="/admin/banner/cau-hoi" />
      <ListToolbar query={q} placeholder="Tìm trong câu hỏi và trả lời" addHref="/admin/banner/cau-hoi/moi" addLabel="Thêm câu hỏi" />
      <SimpleList
        title="Câu hỏi"
        rows={rows.map((row) => ({ id: row.id, title: row.question, meta: row.showOnHome ? "Hiện ở trang chủ" : undefined, visible: row.isVisible }))}
        basePath="/admin/banner/cau-hoi"
        onToggle={toggleFaq}
        onMove={moveFaq}
        onDelete={deleteFaq}
        deleteMessage={(row) => `Xóa câu hỏi "${row.title}"?`}
        empty={q ? "Không tìm thấy câu hỏi nào." : "Chưa có câu hỏi."}
      />
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={(number) => `/admin/banner/cau-hoi?${new URLSearchParams({ ...(q && { q }), page: String(number) })}`} />
    </>
  );
}
