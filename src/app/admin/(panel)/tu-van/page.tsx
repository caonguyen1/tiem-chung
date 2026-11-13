import { count, desc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader, consultStatus, StatusBadge } from "@/components/admin/admin-ui";
import { EmptyList, ListTable, PAGE_SIZE, Pagination, RowActions } from "@/components/admin/admin-list";
import { consultSteps, FilterBar, FilterField, filterControl, StatusSteps } from "@/components/admin/request-ui";
import { db, schema } from "@/db";
import { deleteConsult, setConsultStatus } from "@/lib/actions/admin/requests";
import { consultFilters, vnDateTime } from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Yêu cầu tư vấn" };

export default async function ConsultAdminPage({ searchParams }: PageProps<"/admin/tu-van">) {
  await requireAdmin();
  const raw = await searchParams;
  const { values, where } = consultFilters(raw);
  const page = Math.max(1, Number.parseInt(String(raw.page ?? "1"), 10) || 1);

  const [rows, [total]] = await Promise.all([
    db
      .select()
      .from(schema.consultRequests)
      .where(where)
      .orderBy(desc(schema.consultRequests.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(schema.consultRequests).where(where),
  ]);

  const query = new URLSearchParams(Object.entries(values).filter(([, value]) => value));
  const hrefFor = (number: number) => `/admin/tu-van?${new URLSearchParams([...query, ["page", String(number)]])}`;

  return (
    <>
      <AdminPageHeader title="Yêu cầu tư vấn" description="Khách gửi từ nút “Yêu cầu tư vấn” trên website, mới nhất trên cùng. Nhận xử lý, ghi chú và xuất Excel." />
      <FilterBar resetHref="/admin/tu-van" exportHref={`/admin/tu-van/xuat?${query}`}>
        <FilterField label="Tìm theo tên, số điện thoại hoặc chủ đề">
          <input type="search" name="q" defaultValue={values.q} className={filterControl} />
        </FilterField>
        <FilterField label="Trạng thái">
          <select name="status" defaultValue={values.status} className={filterControl}>
            <option value="">Tất cả</option>
            {Object.entries(consultStatus).map(([key, status]) => (
              <option key={key} value={key}>
                {status.label}
              </option>
            ))}
          </select>
        </FilterField>
      </FilterBar>

      <p className="mb-2 text-sm text-subtle" aria-live="polite">
        <b className="text-brand-800">{total.n}</b> yêu cầu
      </p>
      <ListTable columns={[{ label: "Khách hàng" }, { label: "Trạng thái", className: "w-28" }, { label: "", className: "w-64" }]} empty={rows.length === 0 && <EmptyList text={query.size ? "Không có yêu cầu nào khớp bộ lọc." : "Chưa có yêu cầu tư vấn nào."} />}>
        {rows.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 tab:px-5">
            <div className="min-w-0 flex-1 basis-64">
              <p className="font-bold text-brand-800">
                <Link href={`/admin/tu-van/${item.id}`} className="hover:underline">
                  {item.fullName}
                </Link>{" "}
                <a href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`} className="ml-1 text-[14px] font-bold text-link">
                  {item.phone}
                </a>
              </p>
              <p className="text-[13px] text-subtle">
                {item.topic ?? "Không nêu chủ đề"} · gửi {vnDateTime(item.createdAt)}
              </p>
              {item.note && <p className="mt-0.5 line-clamp-1 text-[13px] text-body">“{item.note}”</p>}
            </div>
            <div className="w-28">
              <StatusBadge tone={consultStatus[item.status].tone}>{consultStatus[item.status].label}</StatusBadge>
            </div>
            <div className="flex w-64 flex-wrap items-center justify-end gap-2">
              <StatusSteps id={item.id} steps={consultSteps[item.status]} action={setConsultStatus} />
              <RowActions id={item.id} editHref={`/admin/tu-van/${item.id}`} onDelete={deleteConsult} deleteMessage={`Xóa yêu cầu của "${item.fullName}"? Không thể hoàn tác.`} />
            </div>
          </li>
        ))}
      </ListTable>
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={hrefFor} />
    </>
  );
}
