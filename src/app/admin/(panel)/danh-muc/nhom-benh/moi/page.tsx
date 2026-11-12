import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DiseaseGroupForm } from "@/components/admin/category-forms";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm nhóm bệnh" };

export default async function NewDiseaseGroupFormPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Thêm nhóm bệnh" />
      <DiseaseGroupForm />
    </>
  );
}
