import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { FaqForm } from "@/components/admin/home-forms";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm câu hỏi" };

export default async function NewFaqPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Thêm câu hỏi" />
      <FaqForm />
    </>
  );
}
