import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AgeGroupForm } from "@/components/admin/category-forms";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm khoảng tuổi" };

export default async function NewAgeGroupFormPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Thêm khoảng tuổi" />
      <AgeGroupForm />
    </>
  );
}
