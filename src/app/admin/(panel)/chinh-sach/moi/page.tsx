import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PolicyForm } from "@/components/admin/policy-form";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Thêm trang chính sách" };

export default async function NewPolicyPage() {
  await requireAdmin();
  return (
    <>
      <AdminPageHeader title="Thêm trang chính sách" />
      <PolicyForm />
    </>
  );
}
