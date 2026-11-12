import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DoctorForm } from "@/components/admin/doctor-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa" };

export default async function EditDoctorPage({
  params,
}: PageProps<"/admin/doi-ngu/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [doctor] = await db
    .select()
    .from(schema.doctors)
    .where(eq(schema.doctors.id, id));
  if (!doctor) notFound();
  return (
    <>
      <AdminPageHeader title={doctor.name} />
      <DoctorForm doctor={doctor} />
    </>
  );
}
