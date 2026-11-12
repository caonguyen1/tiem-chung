import { asc } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PackageForm } from "@/components/admin/package-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm gói vắc xin" };

export default async function NewPackagePage() {
  await requireAdmin();
  const vaccines = await db.select({ id: schema.vaccines.id, name: schema.vaccines.name, price: schema.vaccines.price }).from(schema.vaccines).orderBy(asc(schema.vaccines.sortOrder));
  return (
    <>
      <AdminPageHeader title="Thêm gói vắc xin" />
      <PackageForm vaccines={vaccines} />
    </>
  );
}
