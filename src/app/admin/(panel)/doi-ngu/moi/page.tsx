import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DoctorForm } from "@/components/admin/doctor-form";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm" };

export default async function NewDoctorPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Thêm đội ngũ chuyên môn" />
      <DoctorForm />
    </>
  );
}
