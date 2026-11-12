import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PackageForm } from "@/components/admin/package-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa gói vắc xin" };

export default async function EditPackagePage({ params }: PageProps<"/admin/goi-vac-xin/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [[pkg], vaccines, items] = await Promise.all([
    db.select().from(schema.vaccinePackages).where(eq(schema.vaccinePackages.id, id)),
    db.select({ id: schema.vaccines.id, name: schema.vaccines.name, price: schema.vaccines.price }).from(schema.vaccines).orderBy(asc(schema.vaccines.sortOrder)),
    db.select({ vaccineId: schema.packageItems.vaccineId, doses: schema.packageItems.doses }).from(schema.packageItems).where(eq(schema.packageItems.packageId, id)).orderBy(asc(schema.packageItems.sortOrder)),
  ]);
  if (!pkg) notFound();
  return (
    <>
      <AdminPageHeader title={pkg.name} description={`Địa chỉ trang: /goi-vac-xin/${pkg.slug}`} />
      <PackageForm pkg={pkg} vaccines={vaccines} items={items} />
    </>
  );
}
