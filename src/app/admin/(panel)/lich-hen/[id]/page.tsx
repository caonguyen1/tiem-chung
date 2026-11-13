import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader, appointmentStatus, StatusBadge } from "@/components/admin/admin-ui";
import { AppointmentForm } from "@/components/admin/request-forms";
import { FactList } from "@/components/admin/request-ui";
import { db, schema } from "@/db";
import { itemNames, vnDate, vnDateTime } from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Chi tiết lịch hẹn" };

export default async function AppointmentDetailPage({ params }: PageProps<"/admin/lich-hen/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[row], names] = await Promise.all([
    db
      .select({ item: schema.appointments, center: schema.centers.name })
      .from(schema.appointments)
      .leftJoin(schema.centers, eq(schema.centers.id, schema.appointments.centerId))
      .where(eq(schema.appointments.id, id)),
    itemNames(),
  ]);
  if (!row) notFound();
  const { item, center } = row;

  return (
    <>
      <AdminPageHeader title={`Lịch hẹn của ${item.fullName}`} description={`Gửi lúc ${vnDateTime(item.createdAt)}`} actions={<StatusBadge tone={appointmentStatus[item.status].tone}>{appointmentStatus[item.status].label}</StatusBadge>} />
      <div className="grid gap-4">
        <FactList
          items={[
            ["Họ tên", item.fullName],
            ["Số điện thoại", <a key="tel" href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`} className="text-link">{item.phone}</a>],
            ["Vắc xin / gói", item.itemSlug ? (names.get(item.itemSlug) ?? item.itemSlug) : "Chưa chọn, cần tư vấn"],
            ["Ngày mong muốn", vnDate(item.preferredDate)],
            ["Trung tâm", center],
            ["Ghi chú của khách", item.note],
          ]}
        />
        <AppointmentForm id={item.id} status={item.status} staffNote={item.staffNote} />
      </div>
    </>
  );
}
