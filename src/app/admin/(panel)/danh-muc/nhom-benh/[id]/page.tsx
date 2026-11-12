import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DiseaseGroupForm } from "@/components/admin/category-forms";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa" };

export default async function EditDiseaseGroupFormPage({ params }: PageProps<"/admin/danh-muc/nhom-benh/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [group] = await db.select().from(schema.diseaseGroups).where(eq(schema.diseaseGroups.id, id));
  if (!group) notFound();
  return (
    <>
      <AdminPageHeader title={group.name} />
      <DiseaseGroupForm group={group} />
    </>
  );
}
