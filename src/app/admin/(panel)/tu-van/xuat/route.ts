import { desc } from "drizzle-orm";

import { consultStatus } from "@/components/admin/admin-ui";
import { db, schema } from "@/db";
import { consultFilters, vnDateTime, xlsxResponse } from "@/lib/admin/requests";
import { getAdmin } from "@/lib/auth/session";

/** Excel file of the consult requests that match the list's current filters (same query string). */
export async function GET(request: Request) {
  if (!(await getAdmin())) return new Response("Chưa đăng nhập", { status: 401 });
  const { where } = consultFilters(Object.fromEntries(new URL(request.url).searchParams));
  const rows = await db.select().from(schema.consultRequests).where(where).orderBy(desc(schema.consultRequests.createdAt)).limit(10000);
  const today = new Date().toISOString().slice(0, 10);
  return xlsxResponse(
    `yeu-cau-tu-van-${today}.xlsx`,
    "Yêu cầu tư vấn",
    [
      { header: "Mã", width: 8 },
      { header: "Gửi lúc", width: 18 },
      { header: "Họ tên", width: 26 },
      { header: "Số điện thoại", width: 16 },
      { header: "Chủ đề", width: 30 },
      { header: "Trạng thái", width: 14 },
      { header: "Nội dung khách ghi", width: 40 },
      { header: "Ghi chú nội bộ", width: 40 },
    ],
    rows.map((item) => [item.id, vnDateTime(item.createdAt), item.fullName, item.phone, item.topic ?? "", consultStatus[item.status].label, item.note ?? "", item.staffNote ?? ""]),
  );
}
