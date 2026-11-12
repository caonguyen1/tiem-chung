import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PolicyForm } from "@/components/admin/policy-form";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa trang chính sách" };

export default async function EditPolicyPage({ params }: PageProps<"/admin/chinh-sach/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [policy] = await db.select().from(schema.policyPages).where(eq(schema.policyPages.id, id));
  if (!policy) notFound();
  return (
    <>
      <AdminPageHeader title={policy.title} description={`Địa chỉ trang: /chinh-sach/${policy.slug}`} />
      <PolicyForm policy={policy} />
    </>
  );
}
