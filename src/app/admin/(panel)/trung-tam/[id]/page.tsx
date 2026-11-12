import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { CenterForm } from "@/components/admin/center-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa" };

export default async function EditCenterPage({
  params,
}: PageProps<"/admin/trung-tam/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [center] = await db
    .select()
    .from(schema.centers)
    .where(eq(schema.centers.id, id));
  if (!center) notFound();
  return (
    <>
      <AdminPageHeader title={center.name} />
      <CenterForm center={center} />
    </>
  );
}
