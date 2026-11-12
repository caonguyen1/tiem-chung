import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { VaccineForm } from "@/components/admin/vaccine-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa vắc xin" };

export default async function EditVaccinePage({ params }: PageProps<"/admin/vac-xin/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[vaccine], diseaseGroups, ageGroups, doctors, groupLinks, ageLinks] = await Promise.all([
    db.select().from(schema.vaccines).where(eq(schema.vaccines.id, id)),
    db.select({ id: schema.diseaseGroups.id, name: schema.diseaseGroups.name }).from(schema.diseaseGroups).orderBy(asc(schema.diseaseGroups.sortOrder)),
    db.select({ id: schema.ageGroups.id, label: schema.ageGroups.label }).from(schema.ageGroups).orderBy(asc(schema.ageGroups.sortOrder)),
    db.select({ id: schema.doctors.id, title: schema.doctors.title, name: schema.doctors.name }).from(schema.doctors).orderBy(asc(schema.doctors.sortOrder)),
    db.select({ id: schema.vaccineDiseaseGroups.diseaseGroupId }).from(schema.vaccineDiseaseGroups).where(eq(schema.vaccineDiseaseGroups.vaccineId, id)),
    db.select({ id: schema.vaccineAgeGroups.ageGroupId }).from(schema.vaccineAgeGroups).where(eq(schema.vaccineAgeGroups.vaccineId, id)),
  ]);
  if (!vaccine) notFound();
  return (
    <>
      <AdminPageHeader title={vaccine.name} description={`Địa chỉ trang: /vac-xin/${vaccine.slug}`} />
      <VaccineForm vaccine={vaccine} diseaseGroups={diseaseGroups} ageGroups={ageGroups} doctors={doctors} selectedGroups={groupLinks.map((row) => row.id)} selectedAges={ageLinks.map((row) => row.id)} />
    </>
  );
}
