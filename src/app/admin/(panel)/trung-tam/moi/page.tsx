import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { CenterForm } from "@/components/admin/center-form";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm" };

export default async function NewCenterPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Thêm trung tâm tiêm chủng" />
      <CenterForm />
    </>
  );
}
