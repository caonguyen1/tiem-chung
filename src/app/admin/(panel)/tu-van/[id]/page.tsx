import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader, consultStatus, StatusBadge } from "@/components/admin/admin-ui";
import { ConsultForm } from "@/components/admin/request-forms";
import { FactList } from "@/components/admin/request-ui";
import { db, schema } from "@/db";
import { vnDateTime } from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Chi tiết yêu cầu tư vấn" };

export default async function ConsultDetailPage({ params }: PageProps<"/admin/tu-van/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [item] = await db.select().from(schema.consultRequests).where(eq(schema.consultRequests.id, id));
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title={`Yêu cầu của ${item.fullName}`} description={`Gửi lúc ${vnDateTime(item.createdAt)}`} actions={<StatusBadge tone={consultStatus[item.status].tone}>{consultStatus[item.status].label}</StatusBadge>} />
      <div className="grid gap-4">
        <FactList
          items={[
            ["Họ tên", item.fullName],
            ["Số điện thoại", <a key="tel" href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`} className="text-link">{item.phone}</a>],
            ["Chủ đề", item.topic],
            ["Nội dung khách ghi", item.note],
          ]}
        />
        <ConsultForm id={item.id} status={item.status} staffNote={item.staffNote} />
      </div>
    </>
  );
}
