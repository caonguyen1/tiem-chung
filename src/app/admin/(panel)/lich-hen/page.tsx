import { asc, count, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader, appointmentStatus, StatusBadge } from "@/components/admin/admin-ui";
import { EmptyList, ListTable, PAGE_SIZE, Pagination, RowActions } from "@/components/admin/admin-list";
import { appointmentSteps, FilterBar, FilterField, filterControl, StatusSteps } from "@/components/admin/request-ui";
import { db, schema } from "@/db";
import { deleteAppointment, setAppointmentStatus } from "@/lib/actions/admin/requests";
import { appointmentFilters, itemNames, vnDate, vnDateTime } from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Lịch đặt hẹn" };

export default async function AppointmentsAdminPage({ searchParams }: PageProps<"/admin/lich-hen">) {
  await requireAdmin();
  const raw = await searchParams;
  const { values, where } = appointmentFilters(raw);
  const page = Math.max(1, Number.parseInt(String(raw.page ?? "1"), 10) || 1);

  const [rows, [total], centers, names] = await Promise.all([
    db
      .select({ item: schema.appointments, center: schema.centers.name })
      .from(schema.appointments)
      .leftJoin(schema.centers, eq(schema.centers.id, schema.appointments.centerId))
      .where(where)
      .orderBy(desc(schema.appointments.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(schema.appointments).where(where),
    db.select({ id: schema.centers.id, name: schema.centers.name }).from(schema.centers).orderBy(asc(schema.centers.sortOrder)),
    itemNames(),
  ]);

  const query = new URLSearchParams(Object.entries(values).filter(([, value]) => value));
  const hrefFor = (number: number) => `/admin/lich-hen?${new URLSearchParams([...query, ["page", String(number)]])}`;

  return (
    <>
      <AdminPageHeader title="Lịch đặt hẹn" description="Lịch hẹn khách gửi từ website, mới nhất trên cùng. Lọc theo trung tâm, ngày hẹn, trạng thái rồi xuất Excel." />
      <FilterBar resetHref="/admin/lich-hen" exportHref={`/admin/lich-hen/xuat?${query}`}>
        <FilterField label="Tìm theo tên hoặc số điện thoại">
          <input type="search" name="q" defaultValue={values.q} className={filterControl} />
        </FilterField>
        <FilterField label="Trạng thái">
          <select name="status" defaultValue={values.status} className={filterControl}>
            <option value="">Tất cả</option>
            {Object.entries(appointmentStatus).map(([key, status]) => (
              <option key={key} value={key}>
                {status.label}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Trung tâm">
          <select name="center" defaultValue={values.center} className={filterControl}>
            <option value="">Tất cả</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </FilterField>
        <div className="grid grid-cols-2 gap-2 sm:col-span-1">
          <FilterField label="Hẹn từ ngày">
            <input type="date" name="from" defaultValue={values.from} className={filterControl} />
          </FilterField>
          <FilterField label="đến ngày">
            <input type="date" name="to" defaultValue={values.to} className={filterControl} />
          </FilterField>
        </div>
      </FilterBar>

      <p className="mb-2 text-sm text-subtle" aria-live="polite">
        <b className="text-brand-800">{total.n}</b> lịch hẹn
      </p>
      <ListTable columns={[{ label: "Khách hàng" }, { label: "Trạng thái", className: "w-28" }, { label: "", className: "w-64" }]} empty={rows.length === 0 && <EmptyList text={query.size ? "Không có lịch hẹn nào khớp bộ lọc." : "Chưa có lịch hẹn nào."} />}>
        {rows.map(({ item, center }) => (
          <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 tab:px-5">
            <div className="min-w-0 flex-1 basis-64">
              <p className="font-bold text-brand-800">
                <Link href={`/admin/lich-hen/${item.id}`} className="hover:underline">
                  {item.fullName}
                </Link>{" "}
                <a href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`} className="ml-1 text-[14px] font-bold text-link">
                  {item.phone}
                </a>
              </p>
              <p className="text-[13px] text-subtle">
                {item.itemSlug ? (names.get(item.itemSlug) ?? item.itemSlug) : "Chưa chọn, cần tư vấn"}
                {item.preferredDate && ` · hẹn ${vnDate(item.preferredDate)}`}
                {center && ` · ${center}`} · gửi {vnDateTime(item.createdAt)}
              </p>
              {item.note && <p className="mt-0.5 line-clamp-1 text-[13px] text-body">“{item.note}”</p>}
            </div>
            <div className="w-28">
              <StatusBadge tone={appointmentStatus[item.status].tone}>{appointmentStatus[item.status].label}</StatusBadge>
            </div>
            <div className="flex w-64 flex-wrap items-center justify-end gap-2">
              <StatusSteps id={item.id} steps={appointmentSteps[item.status]} action={setAppointmentStatus} />
              <RowActions id={item.id} editHref={`/admin/lich-hen/${item.id}`} onDelete={deleteAppointment} deleteMessage={`Xóa lịch hẹn của "${item.fullName}"? Không thể hoàn tác.`} />
            </div>
          </li>
        ))}
      </ListTable>
      <Pagination page={page} pages={Math.ceil(total.n / PAGE_SIZE)} hrefFor={hrefFor} />
    </>
  );
}
