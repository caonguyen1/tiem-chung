import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AgeGroupForm } from "@/components/admin/category-forms";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa" };

export default async function EditAgeGroupFormPage({ params }: PageProps<"/admin/danh-muc/do-tuoi/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [age] = await db.select().from(schema.ageGroups).where(eq(schema.ageGroups.id, id));
  if (!age) notFound();
  return (
    <>
      <AdminPageHeader title={age.label} />
      <AgeGroupForm age={age} />
    </>
  );
}
