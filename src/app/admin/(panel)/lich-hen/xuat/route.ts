import { desc, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { appointmentFilters, itemNames, vnDate, vnDateTime, xlsxResponse } from "@/lib/admin/requests";
import { getAdmin } from "@/lib/auth/session";
import { appointmentStatus } from "@/components/admin/admin-ui";

/** Excel file of the appointments that match the list's current filters (same query string). */
export async function GET(request: Request) {
  if (!(await getAdmin())) return new Response("Chưa đăng nhập", { status: 401 });
  const { where } = appointmentFilters(Object.fromEntries(new URL(request.url).searchParams));
  const [rows, names] = await Promise.all([
    db
      .select({ item: schema.appointments, center: schema.centers.name })
      .from(schema.appointments)
      .leftJoin(schema.centers, eq(schema.centers.id, schema.appointments.centerId))
      .where(where)
      .orderBy(desc(schema.appointments.createdAt))
      .limit(10000),
    itemNames(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  return xlsxResponse(
    `lich-hen-${today}.xlsx`,
    "Lịch đặt hẹn",
    [
      { header: "Mã", width: 8 },
      { header: "Gửi lúc", width: 18 },
      { header: "Họ tên", width: 26 },
      { header: "Số điện thoại", width: 16 },
      { header: "Vắc xin / gói", width: 32 },
      { header: "Ngày mong muốn", width: 16 },
      { header: "Trung tâm", width: 24 },
      { header: "Trạng thái", width: 14 },
      { header: "Ghi chú của khách", width: 40 },
      { header: "Ghi chú nội bộ", width: 40 },
    ],
    rows.map(({ item, center }) => [
      item.id,
      vnDateTime(item.createdAt),
      item.fullName,
      item.phone,
      item.itemSlug ? (names.get(item.itemSlug) ?? item.itemSlug) : "Chưa chọn",
      vnDate(item.preferredDate),
      center ?? "",
      appointmentStatus[item.status].label,
      item.note ?? "",
      item.staffNote ?? "",
    ]),
  );
}
