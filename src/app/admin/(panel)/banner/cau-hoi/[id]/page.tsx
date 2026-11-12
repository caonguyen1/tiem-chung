import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { FaqForm } from "@/components/admin/home-forms";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Sửa câu hỏi" };

export default async function EditFaqPage({ params }: PageProps<"/admin/banner/cau-hoi/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [faq] = await db.select().from(schema.faqs).where(eq(schema.faqs.id, id));
  if (!faq) notFound();
  return (
    <>
      <AdminPageHeader title="Sửa câu hỏi" />
      <FaqForm faq={faq} />
    </>
  );
}
