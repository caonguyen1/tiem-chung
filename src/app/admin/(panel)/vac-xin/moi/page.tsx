import { asc } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { VaccineForm } from "@/components/admin/vaccine-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm vắc xin" };

export default async function NewVaccinePage() {
  await requireAdmin();
  const [diseaseGroups, ageGroups, doctors] = await Promise.all([
    db.select({ id: schema.diseaseGroups.id, name: schema.diseaseGroups.name }).from(schema.diseaseGroups).orderBy(asc(schema.diseaseGroups.sortOrder)),
    db.select({ id: schema.ageGroups.id, label: schema.ageGroups.label }).from(schema.ageGroups).orderBy(asc(schema.ageGroups.sortOrder)),
    db.select({ id: schema.doctors.id, title: schema.doctors.title, name: schema.doctors.name }).from(schema.doctors).orderBy(asc(schema.doctors.sortOrder)),
  ]);
  return (
    <>
      <AdminPageHeader title="Thêm vắc xin" />
      <VaccineForm diseaseGroups={diseaseGroups} ageGroups={ageGroups} doctors={doctors} />
    </>
  );
}
